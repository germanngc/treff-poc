# Treff Documentation

Welcome to the Treff project documentation!

## 📖 Table of Contents

### AWS Deployment
- [AWS Infrastructure Overview](./AWS-INFRASTRUCTURE.md)
- **[AWS Manual Setup](./AWS-MANUAL-SETUP.md)** - ⭐ Manual AWS resource creation (OIDC, IAM, S3)
- [Quick Start Guide](./QUICKSTART.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Deployment Checklist](./DEPLOYMENT-CHECKLIST.md)
- [Setup Complete Notes](./SETUP-COMPLETE.md)

### CI/CD & Automation (OIDC Authentication ✅)
- **[GitHub Actions Setup - OIDC](./GITHUB-SETUP-OIDC.md)** - ⭐ **Recommended** - Secure keyless authentication
- [GitHub Setup Quick Checklist](./GITHUB-SETUP-QUICK.md) - 15-minute setup guide
- [GitHub Actions Setup (Legacy)](./GITHUB-SETUP.md) - Original guide with access keys
- **[OIDC Migration Summary](./OIDC-MIGRATION-SUMMARY.md)** - Changes from access keys → OIDC

### Technical Notes
- **[NOTES.md](./NOTES.md)** - Important notes about the infrastructure setup

---

## 🚀 Getting Started

### For New Users (Recommended Path 🌟)

#### Step 1: Manual AWS Setup (OIDC + S3)
1. Start with **[AWS-MANUAL-SETUP.md](./AWS-MANUAL-SETUP.md)** to create:
   - OIDC provider for GitHub Actions
   - IAM role with trust policy
   - Three S3 buckets (frontend, deployments, assets)

#### Step 2: GitHub Configuration
2. Follow **[GITHUB-SETUP-OIDC.md](./GITHUB-SETUP-OIDC.md)** to configure:
   - GitHub Secrets (MySQL passwords)
   - GitHub Variables (AWS region, role ARN, bucket names)
   - GitHub Environment (production)

#### Step 3: Infrastructure Deployment
3. Use **[QUICKSTART.md](./QUICKSTART.md)** to deploy in 5 simple steps:
   - Install dependencies
   - Configure environment variables
   - Deploy CDK infrastructure
   - Verify deployment

#### Step 4: CI/CD Automation
4. Track progress with **[DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)**
5. Push changes to trigger automated deployments via GitHub Actions

### Alternative: Legacy Access Keys Path (Not Recommended ⚠️)
- Use **[GITHUB-SETUP.md](./GITHUB-SETUP.md)** if you must use long-lived AWS credentials
- ⚠️ **Security Warning**: OIDC is more secure and recommended by AWS

### For Understanding the Architecture
- Read **[AWS-INFRASTRUCTURE.md](./AWS-INFRASTRUCTURE.md)** for a complete overview
- Check **[NOTES.md](./NOTES.md)** for important implementation details
- Review **[OIDC-MIGRATION-SUMMARY.md](./OIDC-MIGRATION-SUMMARY.md)** to understand OIDC benefits

---

## 🔐 Authentication Methods

### OIDC (Recommended ✅)
- ✅ No long-lived credentials stored in GitHub
- ✅ Automatic token rotation (short-lived tokens)
- ✅ Better security posture
- ✅ Aligned with AWS best practices
- 📖 **Guide**: [GITHUB-SETUP-OIDC.md](./GITHUB-SETUP-OIDC.md)

### Access Keys (Legacy ⚠️)
- ❌ Requires manual credential rotation
- ❌ Security risk if keys are leaked
- ❌ Not recommended for production
- 📖 **Guide**: [GITHUB-SETUP.md](./GITHUB-SETUP.md)

---

## 💰 Cost Information

All AWS deployment documentation assumes a budget-friendly setup costing approximately **$18-24/month** (or $7-15/month with AWS free tier).

## 📁 Documentation Structure

```
docs/
├── README.md                      # This file - Documentation index
│
├── AWS Deployment
│   ├── AWS-MANUAL-SETUP.md        # ⭐ Manual AWS resource creation (OIDC, S3)
│   ├── AWS-INFRASTRUCTURE.md      # Complete architecture overview
│   ├── QUICKSTART.md              # 5-step quick start guide
│   ├── DEPLOYMENT.md              # Detailed deployment guide
│   ├── DEPLOYMENT-CHECKLIST.md    # Progress tracking checklist
│   └── SETUP-COMPLETE.md          # Setup summary and next steps
│
├── CI/CD & Automation
│   ├── GITHUB-SETUP-OIDC.md       # ⭐ Secure OIDC authentication (recommended)
│   ├── GITHUB-SETUP-QUICK.md      # 15-minute CI/CD quick setup
│   ├── GITHUB-SETUP.md            # Legacy access keys setup
│   └── OIDC-MIGRATION-SUMMARY.md  # OIDC migration details
│
└── Technical Notes
    └── NOTES.md                   # Implementation notes
```

---

## 🔗 Related Documentation

- [Infrastructure Code](../infrastructure/README.md) - CDK infrastructure documentation
- [Main README](../README.md) - Project overview and development setup

---

**Need help?** Check the troubleshooting sections in [DEPLOYMENT.md](./DEPLOYMENT.md)
