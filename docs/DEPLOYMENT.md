# AWS Deployment Guide for Treff POC

## Complete Deployment Checklist

### Phase 1: Prepare AWS Account

- [ ] Create/verify AWS account
- [ ] Install AWS CLI: `brew install awscli` (macOS)
- [ ] Configure AWS credentials: `aws configure`
- [ ] Install Node.js 18+
- [ ] Install AWS CDK: `npm install -g aws-cdk`

### Phase 2: Configure Infrastructure

```bash
# 1. Navigate to infrastructure directory
cd infrastructure

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.template .env

# 4. Edit .env file with your settings
nano .env
```

**Update these values in `.env`:**
```bash
MYSQL_ROOT_PASSWORD=YourSecureRootPassword123!
MYSQL_PASSWORD=YourSecureUserPassword123!
CDK_DEFAULT_ACCOUNT=123456789012  # Your AWS Account ID
CDK_DEFAULT_REGION=us-east-1      # Your preferred region
```

### Phase 3: Deploy Infrastructure

```bash
# 1. Bootstrap CDK (first time only)
cdk bootstrap

# 2. Preview changes
npm run synth

# 3. Deploy
npm run deploy

# 4. Save outputs!
# Copy and save:
# - EC2PublicIP
# - CloudFrontURL
# - FrontendBucket
# - CloudFrontDistributionId
# - MySQLConnectionString
```

### Phase 4: Configure EC2 Instance

**Option A: Using AWS Systems Manager (No SSH key needed)**

```bash
# Get EC2 instance ID from CDK outputs
INSTANCE_ID="i-xxxxxxxxxxxxx"

# Connect to instance
aws ssm start-session --target $INSTANCE_ID

# Once connected, check services
sudo systemctl status mysql
sudo systemctl status nginx
```

**Option B: Using SSH (requires key pair)**

If you need SSH access, you must:
1. Create a key pair in AWS EC2 console
2. Add it to your EC2 instance
3. Download the private key
4. Connect: `ssh -i treff-key.pem ubuntu@<EC2_IP>`

### Phase 5: Deploy Backend

```bash
# 1. Update production settings
nano apps/backend/WebApi/appsettings.Production.json

# Update connection string with your password:
# Server=localhost;Database=treff_v2;Uid=treff_user;Pwd=YOUR_MYSQL_PASSWORD;

# 2. Build the application
cd apps/backend/WebApi
dotnet publish -c Release -o ./publish

# 3. Create deployment package
cd publish
tar -czf backend.tar.gz *

# 4. Upload to EC2 (if using SSH)
scp -i ~/.ssh/treff-key.pem backend.tar.gz ubuntu@<EC2_IP>:/tmp/

# Or use the deployment script
cd ../../../../infrastructure
./scripts/deploy-backend.sh <EC2_IP> ~/.ssh/treff-key.pem
```

**Manual deployment on EC2:**

```bash
# SSH to EC2
ssh -i ~/.ssh/treff-key.pem ubuntu@<EC2_IP>

# Extract application
sudo tar -xzf /tmp/backend.tar.gz -C /var/www/treff-backend/
sudo chown -R www-data:www-data /var/www/treff-backend/

# Update appsettings.Production.json if needed
sudo nano /var/www/treff-backend/appsettings.Production.json

# Start service
sudo systemctl enable treff-backend
sudo systemctl start treff-backend
sudo systemctl status treff-backend

# Check logs
sudo journalctl -u treff-backend -f
```

### Phase 6: Run Database Migrations

```bash
# On EC2, run your migration SQL
sudo mysql -utreff_user -p treff_v2 < /path/to/migration.sql

# Or from your local machine
cd infrastructure
./scripts/run-migration.sh <EC2_IP> ../scripts/init-db.sql ~/.ssh/treff-key.pem
```

### Phase 7: Deploy Frontend

```bash
# 1. Update API endpoint in frontend
# Edit: apps/frontend/src/api/config.js or wherever API URL is configured
# Set it to: http://<EC2_IP>

# 2. Build frontend
cd apps/frontend
npm install
npm run build

# 3. Deploy to S3
aws s3 sync build/ s3://<FRONTEND_BUCKET>/ --delete

# 4. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <CLOUDFRONT_ID> \
  --paths "/*"

# Or use the deployment script
cd ../../infrastructure
./scripts/deploy-frontend.sh <FRONTEND_BUCKET> <CLOUDFRONT_ID>
```

### Phase 8: Verify Deployment

```bash
# 1. Test backend
curl http://<EC2_IP>/swagger

# 2. Test specific endpoint
curl http://<EC2_IP>/api/v1/Product

# 3. Visit frontend
# Open: https://<CLOUDFRONT_URL>

# 4. Check backend logs
ssh -i ~/.ssh/treff-key.pem ubuntu@<EC2_IP>
sudo journalctl -u treff-backend -n 100 --no-pager
```

## Cost Optimization

### Development Mode (Stop EC2 when not in use)

```bash
# Stop instance
aws ec2 stop-instances --instance-ids <INSTANCE_ID>

# Start instance
aws ec2 start-instances --instance-ids <INSTANCE_ID>

# Note: Elastic IP prevents charges when instance is stopped
```

### Database Backups

```bash
# Create backup
cd infrastructure
./scripts/backup-database.sh <EC2_IP> ~/.ssh/treff-key.pem ./backups

# Restore backup (on EC2)
gunzip < backup.sql.gz | mysql -utreff_user -p treff_v2
```

## Monitoring

### CloudWatch Logs

```bash
# View logs in AWS Console
# CloudWatch > Log Groups > /aws/ec2/treff

# Or use CLI
aws logs tail /aws/ec2/treff --follow
```

### Application Logs

```bash
# Backend logs
ssh -i ~/.ssh/treff-key.pem ubuntu@<EC2_IP>
sudo journalctl -u treff-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## Updating the Application

### Backend Updates

```bash
# Simple method - use the script
cd infrastructure
./scripts/deploy-backend.sh <EC2_IP> ~/.ssh/treff-key.pem

# Manual method
cd apps/backend/WebApi
dotnet publish -c Release -o ./publish
scp -r ./publish/* ubuntu@<EC2_IP>:/tmp/backend-update/

ssh -i ~/.ssh/treff-key.pem ubuntu@<EC2_IP>
sudo systemctl stop treff-backend
sudo cp -r /tmp/backend-update/* /var/www/treff-backend/
sudo chown -R www-data:www-data /var/www/treff-backend/
sudo systemctl start treff-backend
```

### Frontend Updates

```bash
cd apps/frontend
npm run build
aws s3 sync build/ s3://<FRONTEND_BUCKET>/ --delete
aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_ID> --paths "/*"
```

## Security Hardening (Production)

1. **Remove MySQL public access:**
   - Edit security group in AWS Console
   - Remove port 3306 ingress rule

2. **Set up SSL/TLS:**
   ```bash
   # Install Certbot on EC2
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Enable AWS WAF for CloudFront** (additional cost)

4. **Use AWS Secrets Manager for passwords** (instead of .env)

5. **Set up automated backups:**
   ```bash
   # Add to crontab on EC2
   0 2 * * * /root/backup-database.sh
   ```

## Troubleshooting

### Backend won't start

```bash
# Check service status
sudo systemctl status treff-backend

# View recent logs
sudo journalctl -u treff-backend -n 100

# Check .NET runtime
/root/.dotnet/dotnet --info

# Test connection string
mysql -utreff_user -p treff_v2 -e "SELECT 1;"
```

### MySQL connection errors

```bash
# Verify MySQL is running
sudo systemctl status mysql

# Check user permissions
sudo mysql -uroot -p
SHOW GRANTS FOR 'treff_user'@'localhost';

# Reset user password
ALTER USER 'treff_user'@'localhost' IDENTIFIED BY 'NewPassword123!';
FLUSH PRIVILEGES;
```

### Frontend not loading

```bash
# Check S3 bucket
aws s3 ls s3://<FRONTEND_BUCKET>/

# Check CloudFront distribution
aws cloudfront get-distribution --id <CLOUDFRONT_ID>

# Force new deployment
aws s3 sync apps/frontend/build/ s3://<FRONTEND_BUCKET>/ --delete --cache-control max-age=0
aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_ID> --paths "/*"
```

## Cleanup

```bash
# Destroy all infrastructure
cd infrastructure
npm run destroy

# WARNING: This deletes:
# - EC2 instance
# - All data in MySQL
# - S3 bucket (if empty)
# - CloudFront distribution
```

## Estimated Costs

| Resource | Monthly Cost |
|----------|--------------|
| EC2 t4g.small | $12.26 |
| EBS 30GB | $2.40 |
| Elastic IP | Free (when attached) |
| S3 Storage (10GB) | $0.23 |
| CloudFront (10GB) | $0.85 |
| Data Transfer | $1-5 |
| **Total** | **~$18-24/month** |

**Free Tier Benefits:**
- First 12 months: 750 hours/month of t2.micro (use t3.micro instead of t4g.small)
- Reduces cost to ~$7-15/month

## Support Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS EC2 Pricing](https://aws.amazon.com/ec2/pricing/)
- [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)
- [AWS Free Tier](https://aws.amazon.com/free/)
