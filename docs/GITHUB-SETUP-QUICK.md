# GitHub Actions CI/CD - Quick Setup Checklist

Use this checklist to quickly set up GitHub Actions for automated deployment.

## ⚡ Quick Setup (15 minutes)

### 1. Create GitHub Environment
- [ ] Go to **Settings → Environments → New environment**
- [ ] Name: `production`
- [ ] (Optional) Add protection rules

### 2. Create AWS IAM User
```bash
# Run these commands:
aws iam create-user --user-name github-actions-deployer

# Create and attach policy (use the policy from GITHUB-SETUP.md)
aws iam put-user-policy --user-name github-actions-deployer \
  --policy-name GitHubActionsDeploymentPolicy \
  --policy-document file://github-actions-policy.json

# Create access keys
aws iam create-access-key --user-name github-actions-deployer
```
- [ ] Save `AccessKeyId` → GitHub Secret `AWS_ACCESS_KEY_ID`
- [ ] Save `SecretAccessKey` → GitHub Secret `AWS_SECRET_ACCESS_KEY`

### 3. Create Deployment Bucket
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws s3 mb s3://treff-deployments-$ACCOUNT_ID
echo "Bucket: treff-deployments-$ACCOUNT_ID"
```
- [ ] Save bucket name → GitHub Secret `DEPLOYMENT_BUCKET`

### 4. Deploy Infrastructure (First Time)
```bash
cd infrastructure
npm install
cp .env.template .env
# Edit .env with passwords
cdk bootstrap
npm run deploy
```
- [ ] Save outputs from CDK deployment

### 5. Configure GitHub Secrets
Go to: `https://github.com/YOUR_USERNAME/treff-poc/settings/secrets/actions`

Click **New repository secret** for each:
- [ ] `AWS_ACCESS_KEY_ID` = `<from step 2>`
- [ ] `AWS_SECRET_ACCESS_KEY` = `<from step 2>`
- [ ] `MYSQL_ROOT_PASSWORD` = `<your password>`
- [ ] `MYSQL_PASSWORD` = `<your password>`
- [ ] `DEPLOYMENT_BUCKET` = `<from step 3>`

### 6. Configure GitHub Variables
Go to: `https://github.com/YOUR_USERNAME/treff-poc/settings/variables/actions`

Click **New repository variable** for each:
- [ ] `AWS_REGION` = `us-east-1`
- [ ] `BACKEND_API_URL` = `http://<EC2_PUBLIC_IP>` (from CDK output)
- [ ] `FRONTEND_BUCKET_NAME` = `<from CDK output>`
- [ ] `CLOUDFRONT_DISTRIBUTION_ID` = `<from CDK output>`

### 7. Test Deployment
- [ ] Make a small change to code
- [ ] Commit and push to `main` branch
- [ ] Go to **Actions** tab in GitHub
- [ ] Verify workflow runs successfully

---

## 📋 Required Secrets Summary

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key | From IAM user creation |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Key | From IAM user creation |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | Same as infrastructure/.env |
| `MYSQL_PASSWORD` | MySQL app user password | Same as infrastructure/.env |
| `DEPLOYMENT_BUCKET` | S3 bucket for artifacts | Create with S3 command |

## 📊 Required Variables Summary

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `AWS_REGION` | AWS deployment region | `us-east-1` |
| `BACKEND_API_URL` | Backend API endpoint | `http://54.123.45.67` |
| `FRONTEND_BUCKET_NAME` | S3 bucket for frontend | `treff-frontend-123456789012` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront dist ID | `E1234567890ABC` |

---

## 🚀 After Setup

Your CI/CD pipeline will automatically:
1. ✅ Build and test on every push
2. ✅ Deploy infrastructure changes when detected
3. ✅ Deploy backend to EC2 via AWS Systems Manager
4. ✅ Deploy frontend to S3 + invalidate CloudFront
5. ✅ Only deploy on `main` branch pushes

---

## 🔄 Workflow Triggers

- **Push to `main`** → Build, test, and deploy
- **Push to `develop`** → Build and test only
- **Pull Request to `main`** → Build and test only

---

## 📚 Full Documentation

See [GITHUB-SETUP.md](./GITHUB-SETUP.md) for:
- Detailed explanations
- Security best practices
- Troubleshooting guide
- IAM policy templates

---

**Estimated Setup Time**: 15-20 minutes
