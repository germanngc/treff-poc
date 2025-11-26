# Treff AWS Deployment - Quick Start

## 🚀 Deploy in 5 Steps

### 1. Prerequisites (5 minutes)

```bash
# Install AWS CLI (macOS)
brew install awscli

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-2), Format (json)

# Install AWS CDK
npm install -g aws-cdk
```

### 2. Setup Infrastructure (2 minutes)

```bash
cd infrastructure

# Install dependencies
npm install

# Create configuration
cp .env.template .env
nano .env  # Update MYSQL_ROOT_PASSWORD and MYSQL_PASSWORD
```

### 3. Deploy to AWS (10 minutes)

```bash
# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy
npm run deploy

# ⚠️ SAVE THE OUTPUTS! You'll need:
# - EC2PublicIP
# - FrontendBucket
# - CloudFrontDistributionId
```

### 4. Deploy Backend (5 minutes)

```bash
# Update production settings
nano ../apps/backend/WebApi/appsettings.Production.json
# Change: Server=localhost;Database=treff_v2;Uid=treff_user;Pwd=YOUR_PASSWORD;

# Build and publish
cd ../apps/backend/WebApi
dotnet publish -c Release -o ./publish
cd publish
tar -czf backend.tar.gz *

# Manual upload (requires SSH key - see DEPLOYMENT.md for setup)
scp -i ~/.ssh/treff-key.pem backend.tar.gz ubuntu@<EC2_IP>:/tmp/

# SSH to EC2
ssh -i ~/.ssh/treff-key.pem ubuntu@<EC2_IP>

# Deploy
sudo tar -xzf /tmp/backend.tar.gz -C /var/www/treff-backend/
sudo chown -R www-data:www-data /var/www/treff-backend/
sudo systemctl enable treff-backend
sudo systemctl start treff-backend
```

### 5. Deploy Frontend (2 minutes)

```bash
# Update API endpoint
# Edit: apps/frontend/src/api/config.js
# Set to: http://<EC2_IP>

# Build and deploy
cd apps/frontend
npm install
npm run build
aws s3 sync build/ s3://<FRONTEND_BUCKET>/ --delete
aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_ID> --paths "/*"
```

## ✅ Verify Deployment

```bash
# Test backend
curl http://<EC2_IP>/swagger

# Test frontend
# Open: https://<CLOUDFRONT_URL> in browser
```

## 📝 Important Notes

**SSH Access:**
- By default, EC2 has no SSH key
- Use AWS Systems Manager: `aws ssm start-session --target <INSTANCE_ID>`
- Or add a key pair in AWS Console and update the EC2 instance

**Costs:**
- ~$18-24/month with t4g.small
- Free tier: Use t3.micro instead (~$7-15/month for first 12 months)

**Security:**
- Change default passwords in `.env`
- Don't commit `.env` to git (already in .gitignore)
- Remove MySQL port 3306 from security group in production

## 🔄 Update Workflow

**Backend:**
```bash
cd infrastructure
./scripts/deploy-backend.sh <EC2_IP> ~/.ssh/treff-key.pem
```

**Frontend:**
```bash
cd infrastructure
./scripts/deploy-frontend.sh <FRONTEND_BUCKET> <CLOUDFRONT_ID>
```

**Database Backup:**
```bash
cd infrastructure
./scripts/backup-database.sh <EC2_IP> ~/.ssh/treff-key.pem ./backups
```

## 🆘 Troubleshooting

**Can't connect to EC2:**
- Use AWS Systems Manager instead: `aws ssm start-session --target <INSTANCE_ID>`
- Check security group allows your IP for port 22

**Backend not responding:**
```bash
ssh -i ~/.ssh/treff-key.pem ubuntu@<EC2_IP>
sudo journalctl -u treff-backend -f
sudo systemctl restart treff-backend
```

**MySQL issues:**
```bash
sudo systemctl status mysql
sudo mysql -utreff_user -p treff_v2
```

## 📚 Full Documentation

See `DEPLOYMENT.md` for complete guide with:
- Detailed step-by-step instructions
- Advanced configuration
- Production hardening
- Monitoring setup
- Cost optimization
- Security best practices

## 🗑️ Cleanup

```bash
cd infrastructure
npm run destroy  # ⚠️ Deletes everything including data!
```

---

**Need Help?**
- Check logs: `sudo journalctl -u treff-backend -f`
- AWS Console: CloudWatch Logs
- Full guide: `DEPLOYMENT.md`
