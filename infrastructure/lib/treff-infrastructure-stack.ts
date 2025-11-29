import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';

export interface TreffInfrastructureStackProps extends cdk.StackProps {
  instanceType: string;
  mysqlRootPassword: string;
  mysqlDatabase: string;
  mysqlUser: string;
  mysqlPassword: string;
  domainName?: string;
  frontendBucketName?: string;
  assetsBucketName?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhone?: string;
}

export class TreffInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TreffInfrastructureStackProps) {
    super(scope, id, props);

    // ========================================
    // VPC and Networking
    // ========================================
    const vpc = new ec2.Vpc(this, 'TreffVPC', {
      maxAzs: 2,
      natGateways: 0, // Save costs - use public subnet only
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Security Group for EC2
    const ec2SecurityGroup = new ec2.SecurityGroup(this, 'TreffEC2SecurityGroup', {
      vpc,
      description: 'Security group for Treff EC2 instance',
      allowAllOutbound: true,
    });

    // Allow HTTP/HTTPS from anywhere
    ec2SecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic'
    );
    ec2SecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic'
    );

    // Allow SSH (optional - for debugging)
    ec2SecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH access'
    );

    // Allow MySQL port (for external access if needed)
    ec2SecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      'Allow MySQL access (optional - can be removed for production)'
    );

    // ========================================
    // EC2 Instance for Backend + MySQL
    // ========================================
    
    // IAM Role for EC2
    const ec2Role = new iam.Role(this, 'TreffEC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
      ],
    });

    // Grant S3 access for deployments (if deployment bucket exists)
    if (props.assetsBucketName) {
      const deploymentBucket = s3.Bucket.fromBucketName(this, 'DeploymentBucket', 'treff-deployments-prod');
      deploymentBucket.grantRead(ec2Role);
    }

    // Grant S3 access to assets bucket for uploads
    // For imported buckets, we need to manually add the policy
    ec2Role.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:PutObject',
        's3:GetObject',
        's3:DeleteObject',
        's3:ListBucket',
      ],
      resources: [
        'arn:aws:s3:::treff-assets-prod',
        'arn:aws:s3:::treff-assets-prod/*',
      ],
    }));

    // User data script
    const userDataScript = ec2.UserData.forLinux();
    userDataScript.addCommands(
      '#!/bin/bash',
      'set -e',
      '',
      '# Update system',
      'apt-get update -y',
      'apt-get upgrade -y',
      '',
      '# Install dependencies',
      'apt-get install -y wget curl git nginx mysql-server mysql-client unzip awscli',
      '',
      '# ========================================',
      '# MySQL Setup',
      '# ========================================',
      'systemctl start mysql',
      'systemctl enable mysql',
      '',
      `# Set MySQL root password`,
      `mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${props.mysqlRootPassword}';"`,
      `mysql -e "FLUSH PRIVILEGES;"`,
      '',
      `# Create database and user`,
      `mysql -uroot -p'${props.mysqlRootPassword}' -e "CREATE DATABASE IF NOT EXISTS ${props.mysqlDatabase};"`,
      `mysql -uroot -p'${props.mysqlRootPassword}' -e "CREATE USER IF NOT EXISTS '${props.mysqlUser}'@'localhost' IDENTIFIED BY '${props.mysqlPassword}';"`,
      `mysql -uroot -p'${props.mysqlRootPassword}' -e "GRANT ALL PRIVILEGES ON ${props.mysqlDatabase}.* TO '${props.mysqlUser}'@'localhost';"`,
      `mysql -uroot -p'${props.mysqlRootPassword}' -e "FLUSH PRIVILEGES;"`,
      '',
      '# Configure MySQL to listen on all interfaces (optional)',
      `sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf`,
      'systemctl restart mysql',
      '',
      '# ========================================',
      '# .NET 8 Runtime Installation',
      '# ========================================',
      'wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh',
      'chmod +x dotnet-install.sh',
      './dotnet-install.sh --channel 8.0 --runtime aspnetcore',
      './dotnet-install.sh --channel 8.0 --runtime dotnet',
      '',
      '# Add .NET to PATH',
      'echo "export DOTNET_ROOT=$HOME/.dotnet" >> /root/.bashrc',
      'echo "export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools" >> /root/.bashrc',
      'export DOTNET_ROOT=$HOME/.dotnet',
      'export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools',
      '',
      '# ========================================',
      '# Application Setup Directory',
      '# ========================================',
      'mkdir -p /var/www/treff-backend',
      'chown -R www-data:www-data /var/www/treff-backend',
      '',
      '# ========================================',
      '# Nginx Configuration',
      '# ========================================',
      'cat > /etc/nginx/sites-available/treff <<EOF',
      'server {',
      '    listen 80;',
      '    server_name _;',
      '',
      '    location / {',
      '        proxy_pass http://127.0.0.1:5000;',
      '        proxy_http_version 1.1;',
      '        proxy_set_header Upgrade \\$http_upgrade;',
      '        proxy_set_header Connection "upgrade";',
      '        proxy_set_header Host \\$host;',
      '        proxy_cache_bypass \\$http_upgrade;',
      '        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;',
      '        proxy_set_header X-Forwarded-Proto \\$scheme;',
      '    }',
      '',
      '    # SignalR WebSocket support',
      '    location /hubs/ {',
      '        proxy_pass http://127.0.0.1:5000;',
      '        proxy_http_version 1.1;',
      '        proxy_set_header Upgrade \\$http_upgrade;',
      '        proxy_set_header Connection "upgrade";',
      '        proxy_set_header Host \\$host;',
      '        proxy_cache_bypass \\$http_upgrade;',
      '        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;',
      '        proxy_set_header X-Forwarded-Proto \\$scheme;',
      '    }',
      '}',
      'EOF',
      '',
      'ln -sf /etc/nginx/sites-available/treff /etc/nginx/sites-enabled/',
      'rm -f /etc/nginx/sites-enabled/default',
      'nginx -t',
      'systemctl restart nginx',
      'systemctl enable nginx',
      '',
      '# ========================================',
      '# Create systemd service for .NET app',
      '# ========================================',
      'cat > /etc/systemd/system/treff-backend.service <<EOF',
      '[Unit]',
      'Description=Treff .NET Backend',
      'After=network.target mysql.service',
      '',
      '[Service]',
      'Type=notify',
      'WorkingDirectory=/var/www/treff-backend',
      'ExecStart=/root/.dotnet/dotnet /var/www/treff-backend/WebApi.dll',
      'Restart=always',
      'RestartSec=10',
      'KillSignal=SIGINT',
      'SyslogIdentifier=treff-backend',
      'User=www-data',
      'Environment=ASPNETCORE_ENVIRONMENT=Production',
      'Environment=DOTNET_ROOT=/root/.dotnet',
      'Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.dotnet:/root/.dotnet/tools',
      ...(props.twilioAccountSid ? [`Environment=TwilioConfig__AccountSid=${props.twilioAccountSid}`] : []),
      ...(props.twilioAuthToken ? [`Environment=TwilioConfig__AuthToken=${props.twilioAuthToken}`] : []),
      ...(props.twilioPhone ? [`Environment=TwilioConfig__Phone=${props.twilioPhone}`] : []),
      '',
      '[Install]',
      'WantedBy=multi-user.target',
      'EOF',
      '',
      'systemctl daemon-reload',
      '# Note: Service will fail until you deploy the application',
      '# systemctl enable treff-backend',
      '',
      '# ========================================',
      '# Create deployment script',
      '# ========================================',
      'cat > /root/deploy-backend.sh <<EOF',
      '#!/bin/bash',
      'echo "Stopping backend service..."',
      'systemctl stop treff-backend',
      '',
      'echo "Deploying new version..."',
      '# Your deployment commands here',
      '# Example: copy files, run migrations, etc.',
      '',
      'echo "Starting backend service..."',
      'systemctl start treff-backend',
      'systemctl status treff-backend',
      'EOF',
      '',
      'chmod +x /root/deploy-backend.sh',
      '',
      '# ========================================',
      '# Install CloudWatch agent (optional)',
      '# ========================================',
      'wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/arm64/latest/amazon-cloudwatch-agent.deb',
      'dpkg -i -E ./amazon-cloudwatch-agent.deb',
      '',
      'echo "EC2 setup complete!"',
      'echo "MySQL root password: ${props.mysqlRootPassword}"',
      'echo "MySQL database: ${props.mysqlDatabase}"',
      'echo "MySQL user: ${props.mysqlUser}"',
      'echo "MySQL password: ${props.mysqlPassword}"',
      'echo ""',
      'echo "Next steps:"',
      'echo "1. Deploy your .NET application to /var/www/treff-backend/"',
      'echo "2. Update connection string in appsettings.Production.json"',
      'echo "3. Run: systemctl enable treff-backend"',
      'echo "4. Run: systemctl start treff-backend"',
    );

    // EC2 Instance
    const ec2Instance = new ec2.Instance(this, 'TreffEC2Instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: new ec2.InstanceType(props.instanceType),
      machineImage: ec2.MachineImage.fromSsmParameter(
        '/aws/service/canonical/ubuntu/server/22.04/stable/current/arm64/hvm/ebs-gp2/ami-id',
        {
          os: ec2.OperatingSystemType.LINUX,
        }
      ),
      securityGroup: ec2SecurityGroup,
      role: ec2Role,
      userData: userDataScript,
      blockDevices: [
        {
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(30, {
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            deleteOnTermination: true,
          }),
        },
      ],
    });

    // Elastic IP for EC2
    const eip = new ec2.CfnEIP(this, 'TreffEC2EIP', {
      instanceId: ec2Instance.instanceId,
    });

    // ========================================
    // S3 Bucket for Frontend (use existing or create new)
    // ========================================
    const frontendBucket = props.frontendBucketName
      ? s3.Bucket.fromBucketName(this, 'TreffFrontendBucket', props.frontendBucketName)
      : new s3.Bucket(this, 'TreffFrontendBucket', {
          bucketName: `treff-frontend-${this.account}`,
          websiteIndexDocument: 'index.html',
          websiteErrorDocument: 'index.html',
          publicReadAccess: false,
          blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
          removalPolicy: cdk.RemovalPolicy.RETAIN,
          autoDeleteObjects: false,
          encryption: s3.BucketEncryption.S3_MANAGED,
        });

    // Origin Access Identity for CloudFront
    const oai = new cloudfront.OriginAccessIdentity(this, 'TreffOAI', {
      comment: 'OAI for Treff frontend',
    });

    // Grant CloudFront read access to the frontend bucket
    // For manually created buckets, we need to add the policy statement directly
    if (props.frontendBucketName) {
      // Imported bucket - add policy manually
      const bucketPolicy = new s3.CfnBucketPolicy(this, 'FrontendBucketPolicy', {
        bucket: props.frontendBucketName,
        policyDocument: {
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                CanonicalUser: oai.cloudFrontOriginAccessIdentityS3CanonicalUserId,
              },
              Action: 's3:GetObject',
              Resource: `arn:aws:s3:::${props.frontendBucketName}/*`,
            },
          ],
        },
      });
    } else if (frontendBucket instanceof s3.Bucket) {
      // CDK-created bucket - use grantRead helper
      frontendBucket.grantRead(oai);
    }

    // ========================================
    // SSL Certificate for Custom Domains
    // ========================================
    // Lookup hosted zones for DNS validation
    const hostedZoneMx = route53.HostedZone.fromLookup(this, 'TreffMxZone', {
      domainName: 'treff.mx',
    });

    const hostedZoneComMx = route53.HostedZone.fromLookup(this, 'TreffComMxZone', {
      domainName: 'treff.com.mx',
    });

    // Import existing certificate from us-east-1 (CloudFront requirement)
    // Manual certificate with DNS validation already configured
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'TreffCertificate',
      'arn:aws:acm:us-east-1:090605004272:certificate/979f3a72-bd55-47b2-a292-8644fd961aa2'
    );

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'TreffDistribution', {
      certificate: certificate,
      domainNames: ['treff.mx', 'www.treff.mx', 'treff.com.mx', 'www.treff.com.mx'],
      defaultBehavior: {
        origin: new origins.S3Origin(frontendBucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(ec2Instance.instancePublicDnsName, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            httpPort: 80,
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        },
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Cheapest option
    });

    // ========================================
    // Route53 DNS Records
    // ========================================
    // A records for treff.mx
    new route53.ARecord(this, 'TreffMxARecord', {
      zone: hostedZoneMx,
      recordName: 'treff.mx',
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.ARecord(this, 'TreffMxWwwARecord', {
      zone: hostedZoneMx,
      recordName: 'www.treff.mx',
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution)
      ),
    });

    // A records for treff.com.mx
    new route53.ARecord(this, 'TreffComMxARecord', {
      zone: hostedZoneComMx,
      recordName: 'treff.com.mx',
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.ARecord(this, 'TreffComMxWwwARecord', {
      zone: hostedZoneComMx,
      recordName: 'www.treff.com.mx',
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution)
      ),
    });

    // ========================================
    // Outputs
    // ========================================
    new cdk.CfnOutput(this, 'EC2PublicIP', {
      value: eip.ref,
      description: 'EC2 Instance Public IP',
    });

    new cdk.CfnOutput(this, 'EC2InstanceId', {
      value: ec2Instance.instanceId,
      description: 'EC2 Instance ID',
    });

    new cdk.CfnOutput(this, 'BackendURL', {
      value: `https://${distribution.distributionDomainName}/`,
      description: 'Backend API URL (via CloudFront)',
    });

    new cdk.CfnOutput(this, 'BackendDirectURL', {
      value: `http://${eip.ref}/`,
      description: 'Backend Direct URL (HTTP only - use CloudFront URL instead)',
    });

    new cdk.CfnOutput(this, 'FrontendBucket', {
      value: frontendBucket.bucketName,
      description: 'S3 Bucket for Frontend',
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront Distribution ID',
    });

    new cdk.CfnOutput(this, 'MySQLConnectionString', {
      value: `Server=${eip.ref};Database=${props.mysqlDatabase};Uid=${props.mysqlUser};Pwd=${props.mysqlPassword};`,
      description: 'MySQL Connection String',
    });

    new cdk.CfnOutput(this, 'SSHCommand', {
      value: `ssh -i your-key.pem ubuntu@${eip.ref}`,
      description: 'SSH Command (you need to add a key pair)',
    });

    new cdk.CfnOutput(this, 'CustomDomains', {
      value: 'https://treff.mx, https://www.treff.mx, https://treff.com.mx, https://www.treff.com.mx',
      description: 'Custom domain URLs',
    });

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
      description: 'ACM Certificate ARN (manual certificate in us-east-1)',
    });
  }
}
