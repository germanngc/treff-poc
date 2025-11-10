# Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

- [ ] AWS account created/verified
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS credentials configured (`aws configure`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] AWS CDK installed (`npm install -g aws-cdk`)
- [ ] Repository cloned locally

## Infrastructure Setup

- [ ] Navigate to `infrastructure/` directory
- [ ] Run `npm install`
- [ ] Copy `.env.template` to `.env`
- [ ] Update `.env` with secure passwords
- [ ] Update `.env` with your AWS account ID
- [ ] Run `cdk bootstrap`
- [ ] Run `npm run synth` to review
- [ ] Run `npm run deploy`
- [ ] Save deployment outputs:
  - [ ] EC2PublicIP: ________________
  - [ ] EC2InstanceId: ________________
  - [ ] FrontendBucket: ________________
  - [ ] CloudFrontURL: ________________
  - [ ] CloudFrontDistributionId: ________________
  - [ ] MySQLConnectionString: ________________

## SSH Setup (Optional but Recommended)

- [ ] Create EC2 key pair in AWS Console
- [ ] Download private key (e.g., `treff-key.pem`)
- [ ] Move to `~/.ssh/` directory
- [ ] Set permissions: `chmod 400 ~/.ssh/treff-key.pem`
- [ ] Add key to EC2 instance via AWS Console
- [ ] Test connection: `ssh -i ~/.ssh/treff-key.pem ubuntu@<EC2_IP>`

## Backend Deployment

- [ ] Update `apps/backend/WebApi/appsettings.Production.json`
  - [ ] Set correct MySQL password
  - [ ] Update Azure Storage config (or migrate to S3)
  - [ ] Update Twilio config (if using)
- [ ] Build backend: `cd apps/backend/WebApi && dotnet publish -c Release -o ./publish`
- [ ] Create package: `cd publish && tar -czf backend.tar.gz *`
- [ ] Upload to EC2 (choose one):
  - [ ] Manual: `scp -i ~/.ssh/treff-key.pem backend.tar.gz ubuntu@<EC2_IP>:/tmp/`
  - [ ] Script: `cd infrastructure && ./scripts/deploy-backend.sh <EC2_IP> ~/.ssh/treff-key.pem`
- [ ] SSH to EC2 and deploy:
  ```bash
  sudo tar -xzf /tmp/backend.tar.gz -C /var/www/treff-backend/
  sudo chown -R www-data:www-data /var/www/treff-backend/
  sudo systemctl enable treff-backend
  sudo systemctl start treff-backend
  ```
- [ ] Verify service: `sudo systemctl status treff-backend`
- [ ] Check logs: `sudo journalctl -u treff-backend -f`

## Database Setup

- [ ] Run initial migration/seed (choose one):
  - [ ] Manual: SSH and run `mysql -utreff_user -p treff_v2 < migration.sql`
  - [ ] Script: `./scripts/run-migration.sh <EC2_IP> migration.sql ~/.ssh/treff-key.pem`
- [ ] Verify database: `mysql -utreff_user -p treff_v2 -e "SHOW TABLES;"`
- [ ] Create first backup: `./scripts/backup-database.sh <EC2_IP> ~/.ssh/treff-key.pem ./backups`

## Frontend Deployment

- [ ] Update API endpoint in frontend code
  - [ ] Find API base URL configuration (e.g., `src/api/config.js`)
  - [ ] Set to: `http://<EC2_IP>`
- [ ] Build frontend: `cd apps/frontend && npm install && npm run build`
- [ ] Deploy to S3 (choose one):
  - [ ] Manual: `aws s3 sync build/ s3://<FRONTEND_BUCKET>/ --delete`
  - [ ] Script: `cd infrastructure && ./scripts/deploy-frontend.sh <FRONTEND_BUCKET> <CLOUDFRONT_ID>`
- [ ] Invalidate CloudFront cache:
  ```bash
  aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_ID> --paths "/*"
  ```
- [ ] Wait 5-10 minutes for CloudFront propagation

## Testing

- [ ] Test backend API:
  - [ ] `curl http://<EC2_IP>/swagger`
  - [ ] `curl http://<EC2_IP>/api/v1/Product`
- [ ] Test frontend:
  - [ ] Open `https://<CLOUDFRONT_URL>` in browser
  - [ ] Verify page loads
  - [ ] Test API calls from frontend
  - [ ] Test user registration/login
  - [ ] Test SignalR/WebSocket features
- [ ] Test database connection from backend
- [ ] Review logs for errors:
  - [ ] Backend: `sudo journalctl -u treff-backend -n 100`
  - [ ] Nginx: `sudo tail -n 100 /var/log/nginx/error.log`
  - [ ] MySQL: `sudo tail -n 100 /var/log/mysql/error.log`

## Security Hardening (Production)

- [ ] Change all default passwords
- [ ] Remove MySQL port (3306) from security group
- [ ] Set up SSL/TLS with Let's Encrypt or ACM
- [ ] Enable AWS WAF on CloudFront (optional, additional cost)
- [ ] Set up custom domain with Route 53 (optional)
- [ ] Enable CloudTrail for audit logging
- [ ] Set up automated database backups (cron job)
- [ ] Use AWS Secrets Manager for credentials (optional)
- [ ] Review IAM permissions and apply least privilege
- [ ] Enable MFA on AWS account
- [ ] Set up billing alerts in AWS Console

## Monitoring Setup

- [ ] Set up CloudWatch alarms:
  - [ ] EC2 CPU > 80%
  - [ ] EC2 Disk usage > 80%
  - [ ] Backend errors
- [ ] Configure SNS topic for alerts
- [ ] Subscribe email to SNS topic
- [ ] Test alerts
- [ ] Set up CloudWatch dashboard (optional)
- [ ] Review CloudWatch Logs regularly

## Documentation

- [ ] Document deployment outputs in team wiki/docs
- [ ] Save `.env` file securely (DO NOT commit to git)
- [ ] Document custom configurations
- [ ] Create runbook for common operations
- [ ] Share deployment guide with team

## Post-Deployment

- [ ] Set up automated backups:
  ```bash
  # On EC2, add to crontab:
  0 2 * * * /root/backup-and-upload-to-s3.sh
  ```
- [ ] Configure monitoring alerts
- [ ] Set up AWS Cost Explorer alerts
- [ ] Test disaster recovery procedure
- [ ] Document rollback procedure
- [ ] Schedule regular security updates
- [ ] Plan scaling strategy

## Ongoing Maintenance

- [ ] Weekly: Review CloudWatch logs and metrics
- [ ] Weekly: Check AWS costs in Cost Explorer
- [ ] Monthly: Update OS packages on EC2
- [ ] Monthly: Review security group rules
- [ ] Monthly: Test backup restoration
- [ ] Quarterly: Review and optimize costs
- [ ] Quarterly: Update .NET runtime and dependencies

## Rollback Checklist (if needed)

- [ ] Stop new deployments
- [ ] Identify last known good version
- [ ] Restore database from backup (if needed)
- [ ] Deploy previous backend version
- [ ] Deploy previous frontend version
- [ ] Invalidate CloudFront cache
- [ ] Verify system functionality
- [ ] Document incident and root cause

## Cost Optimization

- [ ] Review monthly AWS bill
- [ ] Stop EC2 when not needed (development)
- [ ] Use AWS Cost Explorer to identify optimization opportunities
- [ ] Consider Reserved Instances (if running 24/7 for 1+ year)
- [ ] Set up S3 Intelligent Tiering
- [ ] Review CloudFront cache hit ratio
- [ ] Clean up old S3 files
- [ ] Remove unused resources

---

## Quick Reference

**Deployment Commands:**
```bash
# Backend
cd infrastructure
./scripts/deploy-backend.sh <EC2_IP> ~/.ssh/treff-key.pem

# Frontend  
./scripts/deploy-frontend.sh <FRONTEND_BUCKET> <CLOUDFRONT_ID>

# Database backup
./scripts/backup-database.sh <EC2_IP> ~/.ssh/treff-key.pem ./backups

# Database migration
./scripts/run-migration.sh <EC2_IP> migration.sql ~/.ssh/treff-key.pem
```

**Troubleshooting Commands:**
```bash
# Check backend status
ssh ubuntu@<EC2_IP> sudo systemctl status treff-backend

# View backend logs
ssh ubuntu@<EC2_IP> sudo journalctl -u treff-backend -f

# Restart backend
ssh ubuntu@<EC2_IP> sudo systemctl restart treff-backend

# Check MySQL
ssh ubuntu@<EC2_IP> sudo systemctl status mysql

# Test MySQL connection
ssh ubuntu@<EC2_IP> mysql -utreff_user -p treff_v2
```

**Estimated Time to Complete:** 2-3 hours (first time)

**Support:** See `DEPLOYMENT.md` for detailed troubleshooting
