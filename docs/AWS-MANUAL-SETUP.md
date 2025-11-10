# Manual AWS Setup Guide

This guide walks you through manually creating the required AWS resources before deploying the CDK infrastructure.

## 📋 Prerequisites

- AWS CLI installed and configured
- AWS account with admin access
- GitHub repository created

---

## Step 1: Create S3 Buckets

### 1.1 Frontend Bucket (Static Website)

```bash
# Set your AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="us-east-1"  # Change if needed

# Create frontend bucket
FRONTEND_BUCKET="treff-frontend-${ACCOUNT_ID}"
aws s3 mb s3://${FRONTEND_BUCKET} --region ${AWS_REGION}

# Enable versioning (optional, for rollback capability)
aws s3api put-bucket-versioning \
  --bucket ${FRONTEND_BUCKET} \
  --versioning-configuration Status=Enabled

echo "Frontend Bucket: ${FRONTEND_BUCKET}"
```

### 1.2 Deployment Bucket (Build Artifacts)

```bash
# Create deployment bucket
DEPLOYMENT_BUCKET="treff-deployments-${ACCOUNT_ID}"
aws s3 mb s3://${DEPLOYMENT_BUCKET} --region ${AWS_REGION}

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ${DEPLOYMENT_BUCKET} \
  --versioning-configuration Status=Enabled

# Add lifecycle policy to clean up old artifacts
cat > lifecycle-policy.json <<EOF
{
  "Rules": [
    {
      "Id": "DeleteOldArtifacts",
      "Status": "Enabled",
      "Prefix": "",
      "Expiration": {
        "Days": 30
      }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
  --bucket ${DEPLOYMENT_BUCKET} \
  --lifecycle-configuration file://lifecycle-policy.json

echo "Deployment Bucket: ${DEPLOYMENT_BUCKET}"
```

### 1.3 Assets Bucket (User Uploads)

```bash
# Create assets bucket (for user uploads, images, etc.)
ASSETS_BUCKET="treff-assets-${ACCOUNT_ID}"
aws s3 mb s3://${ASSETS_BUCKET} --region ${AWS_REGION}

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ${ASSETS_BUCKET} \
  --versioning-configuration Status=Enabled

# Configure CORS for frontend access
cat > cors-config.json <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket ${ASSETS_BUCKET} \
  --cors-configuration file://cors-config.json

echo "Assets Bucket: ${ASSETS_BUCKET}"
```

### 1.4 Save Bucket Names

```bash
# Save for later use
echo "FRONTEND_BUCKET=${FRONTEND_BUCKET}" >> aws-resources.env
echo "DEPLOYMENT_BUCKET=${DEPLOYMENT_BUCKET}" >> aws-resources.env
echo "ASSETS_BUCKET=${ASSETS_BUCKET}" >> aws-resources.env
echo ""
echo "✅ Buckets created! Saved to aws-resources.env"
cat aws-resources.env
```

---

## Step 2: Create OIDC Provider for GitHub Actions

### 2.1 Create GitHub OIDC Provider

```bash
# Create OIDC provider for GitHub
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

echo "✅ GitHub OIDC Provider created"
```

### 2.2 Verify OIDC Provider

```bash
# List OIDC providers to confirm
aws iam list-open-id-connect-providers
```

---

## Step 3: Create IAM Role for GitHub Actions

### 3.1 Create Trust Policy

Replace `YOUR_GITHUB_ORG` and `YOUR_REPO_NAME` with your values:

```bash
# Set your GitHub details
GITHUB_ORG="germanngc"  # Your GitHub username or organization
GITHUB_REPO="treff-poc"  # Your repository name
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create trust policy
cat > github-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:*"
        }
      }
    }
  ]
}
EOF

echo "✅ Trust policy created"
cat github-trust-policy.json
```

### 3.2 Create Permissions Policy

```bash
cat > github-permissions-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Deployment",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::${FRONTEND_BUCKET}/*",
        "arn:aws:s3:::${FRONTEND_BUCKET}",
        "arn:aws:s3:::${DEPLOYMENT_BUCKET}/*",
        "arn:aws:s3:::${DEPLOYMENT_BUCKET}",
        "arn:aws:s3:::${ASSETS_BUCKET}/*",
        "arn:aws:s3:::${ASSETS_BUCKET}"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EC2Deployment",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceStatus",
        "ec2:DescribeTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SSMDeployment",
      "Effect": "Allow",
      "Action": [
        "ssm:SendCommand",
        "ssm:GetCommandInvocation",
        "ssm:ListCommands",
        "ssm:ListCommandInvocations",
        "ssm:DescribeInstanceInformation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CDKDeployment",
      "Effect": "Allow",
      "Action": [
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResources",
        "cloudformation:GetTemplate",
        "cloudformation:ListStacks",
        "cloudformation:CreateChangeSet",
        "cloudformation:ExecuteChangeSet",
        "cloudformation:DescribeChangeSet",
        "cloudformation:DeleteChangeSet"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CDKAssetPublishing",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::cdk-*"
    },
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Sid": "GetCallerIdentity",
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity"
      ],
      "Resource": "*"
    }
  ]
}
EOF

echo "✅ Permissions policy created"
cat github-permissions-policy.json
```

### 3.3 Create the IAM Role

```bash
# Create the role
aws iam create-role \
  --role-name GitHubActionsDeploymentRole \
  --assume-role-policy-document file://github-trust-policy.json \
  --description "Role for GitHub Actions to deploy Treff application"

# Attach the permissions policy
aws iam put-role-policy \
  --role-name GitHubActionsDeploymentRole \
  --policy-name GitHubActionsDeploymentPolicy \
  --policy-document file://github-permissions-policy.json

# Get the role ARN
ROLE_ARN=$(aws iam get-role --role-name GitHubActionsDeploymentRole --query 'Role.Arn' --output text)

echo "✅ IAM Role created"
echo "Role ARN: ${ROLE_ARN}"
echo "ROLE_ARN=${ROLE_ARN}" >> aws-resources.env
```

---

## Step 4: Update Infrastructure Code

The CDK infrastructure needs to reference these pre-created buckets instead of creating new ones.

### 4.1 Update infrastructure/.env

```bash
cd infrastructure
cp .env.template .env

# Edit .env and add:
cat >> .env <<EOF

# Pre-created S3 Buckets
FRONTEND_BUCKET_NAME=${FRONTEND_BUCKET}
DEPLOYMENT_BUCKET_NAME=${DEPLOYMENT_BUCKET}
ASSETS_BUCKET_NAME=${ASSETS_BUCKET}
EOF
```

---

## Step 5: Configure GitHub Repository

### 5.1 Add Repository Secrets

Go to: `Settings → Secrets and variables → Actions → Secrets`

**Add these secrets:**
- `MYSQL_ROOT_PASSWORD` - Your MySQL root password
- `MYSQL_PASSWORD` - Your MySQL application user password

### 5.2 Add Repository Variables

Go to: `Settings → Secrets and variables → Actions → Variables`

**Add these variables:**
```bash
# Copy these values from aws-resources.env
AWS_REGION=us-east-1
AWS_ROLE_ARN=arn:aws:iam::123456789012:role/GitHubActionsDeploymentRole
FRONTEND_BUCKET_NAME=treff-frontend-123456789012
DEPLOYMENT_BUCKET_NAME=treff-deployments-123456789012
ASSETS_BUCKET_NAME=treff-assets-123456789012
BACKEND_API_URL=http://YOUR_EC2_IP  # Update after CDK deployment
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC  # Update after CDK deployment
```

---

## Step 6: Verify Setup

### 6.1 Test AWS CLI Access

```bash
# Should return your account details
aws sts get-caller-identity
```

### 6.2 Verify Buckets Exist

```bash
aws s3 ls | grep treff
```

### 6.3 Verify OIDC Provider

```bash
aws iam list-open-id-connect-providers
```

### 6.4 Verify IAM Role

```bash
aws iam get-role --role-name GitHubActionsDeploymentRole
```

---

## 📋 Summary - What You Created

### S3 Buckets
- ✅ `treff-frontend-{account-id}` - Static website hosting
- ✅ `treff-deployments-{account-id}` - Build artifacts (30-day lifecycle)
- ✅ `treff-assets-{account-id}` - User uploads and media files

### IAM Resources
- ✅ OIDC Provider for GitHub Actions
- ✅ IAM Role: `GitHubActionsDeploymentRole`
- ✅ Permissions policy attached to role

### Configuration Files
- ✅ `aws-resources.env` - All resource names and ARNs
- ✅ `github-trust-policy.json` - Trust relationship
- ✅ `github-permissions-policy.json` - Permissions policy

---

## 🔒 Security Benefits

✅ **No long-lived credentials** - Uses OIDC tokens (expire in 1 hour)  
✅ **Least privilege** - Only grants necessary permissions  
✅ **Repository-specific** - Only your repo can assume the role  
✅ **Audit trail** - CloudTrail logs all API calls  
✅ **Easy to revoke** - Just delete the role  

---

## 🧹 Cleanup (if needed)

```bash
# Delete IAM role
aws iam delete-role-policy --role-name GitHubActionsDeploymentRole --policy-name GitHubActionsDeploymentPolicy
aws iam delete-role --role-name GitHubActionsDeploymentRole

# Delete OIDC provider
OIDC_ARN=$(aws iam list-open-id-connect-providers --query 'OpenIDConnectProviderList[?contains(Arn, `token.actions.githubusercontent.com`)].Arn' --output text)
aws iam delete-open-id-connect-provider --open-id-connect-provider-arn ${OIDC_ARN}

# Delete buckets (WARNING: This deletes all data!)
aws s3 rb s3://${FRONTEND_BUCKET} --force
aws s3 rb s3://${DEPLOYMENT_BUCKET} --force
aws s3 rb s3://${ASSETS_BUCKET} --force
```

---

## 📚 Next Steps

1. ✅ Complete this manual setup
2. Update CDK infrastructure to use existing buckets
3. Update GitHub Actions workflow to use OIDC
4. Deploy infrastructure: `cd infrastructure && npm run deploy`
5. Update GitHub variables with CDK outputs
6. Push to main and watch automated deployment!

---

**Estimated Time**: 10-15 minutes
