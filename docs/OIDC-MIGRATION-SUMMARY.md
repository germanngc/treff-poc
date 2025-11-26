# OIDC Migration Summary

This document summarizes the changes made to transition from long-lived AWS access keys to OIDC (OpenID Connect) authentication for GitHub Actions.

## 🎯 What Changed?

### Before (Access Keys ❌)
- Stored `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in GitHub Secrets
- Long-lived credentials that required manual rotation every 90 days
- Security risk if keys were leaked or compromised
- IAM user required with programmatic access

### After (OIDC ✅)
- No AWS access keys stored in GitHub
- GitHub Actions requests short-lived tokens from AWS for each workflow run
- Tokens automatically expire after use (no rotation needed)
- IAM role with trust relationship to GitHub OIDC provider
- More secure and aligned with AWS best practices

## 📝 Files Modified

### 1. GitHub Actions Workflow
**File**: `.github/workflows/ci-cd.yml`

**Changes**:
- ✅ Added `permissions` block with `id-token: write` for OIDC
- ✅ Replaced `aws-access-key-id` + `aws-secret-access-key` with `role-to-assume`
- ✅ Updated to use `aws-actions/configure-aws-credentials@v4`
- ✅ Added `role-session-name` for better CloudTrail tracking
- ✅ Updated bucket references to use `vars.DEPLOYMENT_BUCKET_NAME`

**Jobs affected**:
- `deploy-infrastructure`
- `deploy-backend`
- `deploy-frontend`

### 2. CDK Infrastructure Code
**File**: `infrastructure/lib/treff-infrastructure-stack.ts`

**Changes**:
- ✅ Added `frontendBucketName?: string` to stack props
- ✅ Added `assetsBucketName?: string` to stack props
- ✅ Modified S3 bucket creation to conditionally use existing buckets:
  ```typescript
  const frontendBucket = props.frontendBucketName
    ? s3.Bucket.fromBucketName(this, 'FrontendBucket', props.frontendBucketName)
    : new s3.Bucket(this, 'FrontendBucket', { ... });
  ```
- ✅ Added conditional OAI grant (only if bucket was created, not imported)

**File**: `infrastructure/bin/app.ts`

**Changes**:
- ✅ Added environment variable reads for bucket names:
  ```typescript
  frontendBucketName: process.env.FRONTEND_BUCKET_NAME,
  assetsBucketName: process.env.ASSETS_BUCKET_NAME,
  ```

**File**: `infrastructure/.env.template`

**Changes**:
- ✅ Added optional bucket name variables:
  ```bash
  # Optional: Use existing S3 buckets (if manually created)
  # FRONTEND_BUCKET_NAME=treff-frontend-prod
  # ASSETS_BUCKET_NAME=treff-assets-prod
  ```

### 3. Documentation Created
**New files**:
1. ✅ `docs/AWS-MANUAL-SETUP.md` - Complete manual AWS setup guide
   - S3 bucket creation commands
   - OIDC provider setup
   - IAM role creation with trust policy
   - Permissions policy JSON
   - Verification commands

2. ✅ `docs/GITHUB-SETUP-OIDC.md` - New GitHub Actions setup guide
   - OIDC authentication explanation
   - Step-by-step setup instructions
   - Updated secrets/variables requirements
   - Security best practices
   - Troubleshooting OIDC-specific issues

3. ✅ `docs/OIDC-MIGRATION-SUMMARY.md` - This file!

**Updated files**:
- ✅ `docs/GITHUB-SETUP.md` - Updated checklist to reflect OIDC approach

## 🔧 AWS Resources Required

### Manual Creation (Before CDK Deployment)

You must manually create these resources **before** deploying CDK:

#### 1. OIDC Provider
```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

**Purpose**: Allows AWS to trust GitHub's OIDC tokens

#### 2. IAM Role: GitHubActionsDeploymentRole
```bash
aws iam create-role \
  --role-name GitHubActionsDeploymentRole \
  --assume-role-policy-document file://trust-policy.json
```

**Trust Policy** (trust-policy.json):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:germanngc/treff-poc:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

**Permissions Policy** (attached to role):
- CloudFormation (for CDK deployments)
- EC2 (for instance management)
- S3 (for frontend/backend uploads)
- CloudFront (for cache invalidation)
- SSM (for backend deployment)
- IAM (read-only for role assumption)

#### 3. Three S3 Buckets
```bash
# Frontend static hosting
aws s3 mb s3://treff-frontend-prod --region us-east-2

# Deployment artifacts (backend builds)
aws s3 mb s3://treff-deployments-prod --region us-east-2

# User-uploaded assets
aws s3 mb s3://treff-assets-prod --region us-east-2
```

**Why manual?**: 
- Better security control
- Consistent naming across environments
- Easier to manage bucket policies manually
- No accidental deletion by CDK

## 🔐 GitHub Secrets & Variables Changes

### Secrets (REMOVED ❌)
- ❌ `AWS_ACCESS_KEY_ID` - **No longer needed!**
- ❌ `AWS_SECRET_ACCESS_KEY` - **No longer needed!**
- ❌ `DEPLOYMENT_BUCKET` - Moved to variables

### Secrets (KEPT ✅)
- ✅ `MYSQL_ROOT_PASSWORD`
- ✅ `MYSQL_PASSWORD`
- ✅ `DFX_IDENTITY` (optional, for ICP)

### Variables (NEW ✅)
- ✅ `AWS_ROLE_ARN` - GitHubActionsDeploymentRole ARN
- ✅ `FRONTEND_BUCKET_NAME` - Manually created frontend bucket
- ✅ `DEPLOYMENT_BUCKET_NAME` - Manually created deployments bucket
- ✅ `ASSETS_BUCKET_NAME` - Manually created assets bucket

### Variables (KEPT ✅)
- ✅ `AWS_REGION`
- ✅ `CLOUDFRONT_DISTRIBUTION_ID`
- ✅ `BACKEND_API_URL`

## 🚀 Deployment Workflow Changes

### Before (Access Keys)
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ vars.AWS_REGION }}
```

### After (OIDC)
```yaml
permissions:
  id-token: write   # Required for OIDC
  contents: read    # Required to checkout code

- name: Configure AWS credentials (OIDC)
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ vars.AWS_ROLE_ARN }}
    aws-region: ${{ vars.AWS_REGION }}
    role-session-name: GitHubActions-Infrastructure
```

**Key differences**:
- `permissions` block grants OIDC token access
- `role-to-assume` instead of access keys
- `role-session-name` for CloudTrail tracking

## 📋 Migration Checklist

### Phase 1: AWS Setup ✓
- [ ] Create OIDC provider in AWS (see [AWS-MANUAL-SETUP.md](./AWS-MANUAL-SETUP.md))
- [ ] Create GitHubActionsDeploymentRole with trust policy
- [ ] Attach permissions policy to role
- [ ] Create 3 S3 buckets (frontend, deployments, assets)
- [ ] Verify all resources with AWS CLI

### Phase 2: Infrastructure Code ✓
- [ ] Update `infrastructure/lib/treff-infrastructure-stack.ts`
- [ ] Update `infrastructure/bin/app.ts`
- [ ] Update `infrastructure/.env.template`
- [ ] Update `infrastructure/.env` with bucket names (if using manual buckets)
- [ ] Test CDK synthesis: `npm run synth`

### Phase 3: GitHub Actions ✓
- [ ] Update `.github/workflows/ci-cd.yml` with OIDC configuration
- [ ] Add `permissions` block to all deployment jobs
- [ ] Replace access key authentication with role assumption
- [ ] Update bucket references to use variables

### Phase 4: GitHub Configuration ✓
- [ ] **Remove** GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- [ ] **Add** GitHub Variable: `AWS_ROLE_ARN`
- [ ] **Add** GitHub Variable: `DEPLOYMENT_BUCKET_NAME`
- [ ] Update existing variables if needed

### Phase 5: Testing ✓
- [ ] Test OIDC authentication locally (if possible)
- [ ] Make test commit and push to `main` branch
- [ ] Verify workflow runs successfully with OIDC
- [ ] Check CloudTrail logs for role assumption events
- [ ] Verify backend deploys to EC2 via SSM
- [ ] Verify frontend deploys to S3 and CloudFront invalidates

### Phase 6: Cleanup ✓
- [ ] Delete old IAM user (if created for GitHub Actions)
- [ ] Rotate any remaining access keys
- [ ] Update team documentation
- [ ] Archive old deployment guides

## 🔍 Verification Commands

### Verify OIDC Provider
```bash
aws iam list-open-id-connect-providers

# Expected output:
# {
#   "OpenIDConnectProviderList": [
#     {
#       "Arn": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
#     }
#   ]
# }
```

### Verify IAM Role
```bash
aws iam get-role --role-name GitHubActionsDeploymentRole

# Check trust policy allows GitHub
aws iam get-role --role-name GitHubActionsDeploymentRole \
  --query 'Role.AssumeRolePolicyDocument'
```

### Verify S3 Buckets
```bash
aws s3 ls | grep treff

# Expected output:
# 2024-12-XX 12:00:00 treff-assets-prod
# 2024-12-XX 12:00:00 treff-deployments-prod
# 2024-12-XX 12:00:00 treff-frontend-prod
```

### Test OIDC Workflow
```bash
# Push a test commit
echo "# OIDC test" >> README.md
git add README.md
git commit -m "test: Verify OIDC authentication"
git push origin main

# Watch workflow
# https://github.com/germanngc/treff-poc/actions
```

### Check CloudTrail for OIDC Events
```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=GitHubActionsDeploymentRole \
  --max-results 5
```

## 🛡️ Security Benefits

### Before (Access Keys)
- ❌ Long-lived credentials (valid until manually rotated)
- ❌ Stored in GitHub Secrets (encrypted but still persistent)
- ❌ Manual rotation required every 90 days
- ❌ Risk of key leakage in logs or errors
- ❌ Broad permissions often granted to simplify management

### After (OIDC)
- ✅ Short-lived tokens (expire after each workflow run)
- ✅ No credentials stored in GitHub
- ✅ Automatic "rotation" on every run
- ✅ No risk of long-term key compromise
- ✅ Fine-grained permissions per repository/branch
- ✅ Better audit trail (role session names in CloudTrail)
- ✅ Aligned with AWS security best practices

## 📚 Reference Documentation

### Created Documentation
1. **[AWS Manual Setup](./AWS-MANUAL-SETUP.md)**
   - Complete AWS resource creation guide
   - OIDC provider setup
   - IAM role configuration
   - S3 bucket creation

2. **[GitHub Setup - OIDC](./GITHUB-SETUP-OIDC.md)**
   - GitHub Actions configuration for OIDC
   - Secrets and variables setup
   - Step-by-step deployment guide
   - Troubleshooting OIDC issues

3. **[GitHub Setup](./GITHUB-SETUP.md)** (Updated)
   - Checklist reflects OIDC approach
   - Security best practices updated

### External Resources
- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS IAM OIDC Providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [AWS CDK Best Practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html)

## 🎉 Next Steps

1. **Follow Manual Setup Guide**: [AWS-MANUAL-SETUP.md](./AWS-MANUAL-SETUP.md)
2. **Configure GitHub**: [GITHUB-SETUP-OIDC.md](./GITHUB-SETUP-OIDC.md)
3. **Deploy Infrastructure**: `cd infrastructure && npm run deploy`
4. **Test Workflow**: Push to `main` branch
5. **Monitor**: Check CloudTrail and GitHub Actions logs

## ❓ Troubleshooting

If you encounter issues, see:
- [GITHUB-SETUP-OIDC.md - Troubleshooting Section](./GITHUB-SETUP-OIDC.md#-troubleshooting)
- [AWS-MANUAL-SETUP.md - Verification Section](./AWS-MANUAL-SETUP.md#verification)

Common issues:
- **"Could not assume role"** → Verify trust policy includes correct repository
- **"Invalid identity token"** → Check OIDC provider thumbprint
- **"Access denied"** → Review IAM role permissions policy

---

**Migration Status**: ✅ Complete  
**Authentication Method**: OIDC (OpenID Connect)  
**Last Updated**: December 2024

