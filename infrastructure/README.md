# Treff AWS Infrastructure

This directory contains AWS CDK infrastructure code to deploy the Treff application to AWS.

## Architecture

**Ultra-Budget Setup (~$18-24/month)**

```
┌─────────────────────────────────────────────────┐
│                   AWS Cloud                     │
├─────────────────────────────────────────────────┤
│                                                 │
│    ┌────────────────┐     ┌────────────────┐    │
│    │                │     │                │    │
│    │   CloudFront   │────▶│   S3 Bucket    │    │
│    │  Distribution  │     │   (Frontend)   │    │
│    │                │     │                │    │
│    └────────────────┘     └────────────────┘    │
│           │                                     │
│           │  HTTPS                              │
│           ▼                                     │
│  ┌───────────────────────────────────────────┐  │
│  │  VPC (10.0.0.0/16)                        │  │
│  │                                           │  │
│  │  ┌────────────────────────────────────┐   │  │
│  │  │  Public Subnet                     │   │  │
│  │  │                                    │   │  │
│  │  │  ┌──────────────────────────────┐  │   │  │
│  │  │  │  EC2 t4g.small Instance      │  │   │  │
│  │  │  │  (Ubuntu 22.04 ARM)          │  │   │  │
│  │  │  │                              │  │   │  │
│  │  │  │  ┌────────────────────────┐  │  │   │  │
│  │  │  │  │  Nginx :80/:443        │  │  │   │  │
│  │  │  │  └────────┬───────────────┘  │  │   │  │
│  │  │  │           │                  │  │   │  │
│  │  │  │  ┌────────▼───────────────┐  │  │   │  │
│  │  │  │  │  .NET Backend :5000    │  │  │   │  │
│  │  │  │  │  (Kestrel + SignalR)   │  │  │   │  │
│  │  │  │  └────────┬───────────────┘  │  │   │  │
│  │  │  │           │                  │  │   │  │
│  │  │  │  ┌────────▼───────────────┐  │  │   │  │ 
│  │  │  │  │  MySQL 8.0 :3306       │  │  │   │  │
│  │  │  │  │  Database: treff_v2    │  │  │   │  │
│  │  │  │  └────────────────────────┘  │  │   │  │
│  │  │  │                              │  │   │  │
│  │  │  │  Elastic IP: x.x.x.x         │  │   │  │
│  │  │  └──────────────────────────────┘  │   │  │
│  │  │                                    │   │  │
│  │  └────────────────────────────────────┘   │  │
│  │                                           │  │
│  │  Security Group Rules:                    │  │
│  │  - Port 80  (HTTP)     ← Internet         │  │
│  │  - Port 443 (HTTPS)    ← Internet         │  │
│  │  - Port 22  (SSH)      ← Your IP          │  │
│  │  - Port 3306 (MySQL)   ← Optional         │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Components:**
- **Frontend**: S3 + CloudFront
- **Backend + Database**: Single EC2 t4g.small instance
  - .NET Core backend (Kestrel)
  - MySQL database
  - Nginx reverse proxy
  - Redis (optional)

## Prerequisites

1. **AWS Account** with CLI configured
2. **Node.js** (v18+) and npm
3. **AWS CDK** installed globally: `npm install -g aws-cdk`
4. **AWS credentials** configured: `aws configure`

## Installation

```bash
cd infrastructure
npm install
```

## Configuration

Set environment variables (or use defaults):

```bash
export MYSQL_ROOT_PASSWORD="YourSecurePassword123!"
export MYSQL_PASSWORD="TreffUserPassword123!"
export CDK_DEFAULT_REGION="us-east-2"
```

## Deployment

### 1. Bootstrap CDK (first time only)

```bash
cdk bootstrap
```

### 2. Review what will be created

```bash
npm run synth
```

### 3. Deploy infrastructure

```bash
npm run deploy
```

This will create:
- VPC with public subnets
- EC2 t4g.small instance with:
  - Ubuntu 22.04 ARM
  - .NET 8 runtime
  - MySQL 8.0
  - Nginx
- S3 bucket for frontend
- CloudFront distribution
- Elastic IP for EC2
- Security groups

### 4. Note the outputs

After deployment, save these outputs:
- `EC2PublicIP`: Your backend server IP
- `CloudFrontURL`: Your frontend URL
- `MySQLConnectionString`: Database connection string
- `FrontendBucket`: S3 bucket name

## Post-Deployment Steps

### 1. Connect to EC2

```bash
# Use AWS Systems Manager Session Manager (no SSH key needed)
aws ssm start-session --target <EC2InstanceId>

# Or SSH if you added a key pair
ssh -i your-key.pem ubuntu@<EC2PublicIP>
```

### 2. Deploy Backend Application

```bash
# On your local machine, build the backend
cd apps/backend/WebApi
dotnet publish -c Release -o ./publish

# Create a zip file
cd publish
zip -r backend.zip .

# Upload to EC2
scp -i your-key.pem backend.zip ubuntu@<EC2PublicIP>:/tmp/

# On EC2, extract and deploy
ssh -i your-key.pem ubuntu@<EC2PublicIP>
sudo su
unzip /tmp/backend.zip -d /var/www/treff-backend/
chown -R www-data:www-data /var/www/treff-backend/

# Update connection string
nano /var/www/treff-backend/appsettings.Production.json
# Update: "Server=localhost;Database=treff_v2;Uid=treff_user;Pwd=<MYSQL_PASSWORD>;"

# Start the service
systemctl enable treff-backend
systemctl start treff-backend
systemctl status treff-backend
```

### 3. Run Database Migrations

```bash
# On EC2, run your migrations
cd /var/www/treff-backend
mysql -utreff_user -p treff_v2 < /path/to/your/migration.sql

# Or use EF Core migrations
dotnet ef database update --project /path/to/project
```

### 4. Deploy Frontend

```bash
# On your local machine, build the frontend
cd apps/frontend
npm run build

# Deploy to S3
aws s3 sync build/ s3://<FrontendBucket>/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <CloudFrontDistributionId> \
  --paths "/*"
```

### 5. Update Frontend API Endpoint

Update `apps/frontend/src/api/config.js` or your API base URL to point to:
```
http://<EC2PublicIP>
```

Or set up a custom domain with Route 53.

## Cost Optimization Tips

1. **Stop EC2 when not in use** (development):
   ```bash
   aws ec2 stop-instances --instance-ids <EC2InstanceId>
   aws ec2 start-instances --instance-ids <EC2InstanceId>
   ```

2. **Use Spot Instances** (70% cheaper, but can be interrupted)

3. **Enable S3 Intelligent Tiering** for frontend assets

4. **Set CloudFront cache headers** to reduce origin requests

## Monitoring

```bash
# Check backend logs
sudo journalctl -u treff-backend -f

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## Updating the Application

### Backend Updates

```bash
# Build and upload new version
dotnet publish -c Release -o ./publish
scp -r ./publish/* ubuntu@<EC2PublicIP>:/tmp/backend-update/

# On EC2
sudo systemctl stop treff-backend
sudo cp -r /tmp/backend-update/* /var/www/treff-backend/
sudo chown -R www-data:www-data /var/www/treff-backend/
sudo systemctl start treff-backend
```

### Frontend Updates

```bash
npm run build
aws s3 sync build/ s3://<FrontendBucket>/ --delete
aws cloudfront create-invalidation --distribution-id <CloudFrontDistributionId> --paths "/*"
```

## Cleanup

To destroy all resources:

```bash
npm run destroy
```

**Warning**: This will delete everything including the database!

## Troubleshooting

### Backend not responding

```bash
# Check if service is running
sudo systemctl status treff-backend

# Check logs
sudo journalctl -u treff-backend -n 100

# Restart service
sudo systemctl restart treff-backend
```

### MySQL connection issues

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -utreff_user -p treff_v2

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Nginx issues

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

## Security Recommendations

1. **Change default passwords** in production
2. **Restrict MySQL port** (3306) in security group
3. **Enable AWS WAF** for CloudFront (additional cost)
4. **Set up SSL/TLS** with Let's Encrypt or AWS Certificate Manager
5. **Enable CloudTrail** for audit logging
6. **Set up automated backups** for MySQL
7. **Use AWS Secrets Manager** for sensitive credentials

## Estimated Monthly Costs

- EC2 t4g.small: ~$12/month
- EBS Storage (30GB): ~$2.40/month
- S3 + CloudFront: ~$1-5/month
- Data Transfer: ~$1-5/month
- **Total: ~$18-24/month**

## Support

For issues, check:
1. CloudWatch Logs
2. EC2 System Manager Session Manager
3. AWS Cost Explorer for unexpected charges
