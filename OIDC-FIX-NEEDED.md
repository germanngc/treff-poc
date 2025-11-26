# OIDC Authorization Issue Fix

## Error
```
Error: Could not assume role with OIDC: Not authorized to perform sts:AssumeRoleWithWebIdentity
```

## Root Cause
The IAM role `GitHubActionsDeploymentRole` trust policy needs to allow the GitHub OIDC provider.

## Fix Required in AWS Console

### Step 1: Update Trust Policy
Go to AWS IAM Console → Roles → GitHubActionsDeploymentRole → Trust relationships → Edit trust policy

Replace with this exact JSON (update your account ID and repo):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::090605004272:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:germanngc/treff-poc:*"
        }
      }
    }
  ]
}
```

### Step 2: Verify OIDC Provider Exists
AWS IAM Console → Identity providers → Check that `token.actions.githubusercontent.com` exists

If not, create it:
```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### Step 3: Re-run GitHub Actions
Once trust policy is updated, re-run the failed workflow.

## Verification Command
```bash
aws iam get-role --role-name GitHubActionsDeploymentRole --query 'Role.AssumeRolePolicyDocument'
```
