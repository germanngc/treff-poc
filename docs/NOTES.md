# AWS Infrastructure Setup Notes

## What was created:

### Infrastructure (/infrastructure folder)
- AWS CDK project with TypeScript
- VPC with public subnets
- EC2 t4g.small instance (ARM-based, cheaper)
- S3 bucket for frontend
- CloudFront distribution
- Security groups and networking

### EC2 Setup (Automated via User Data)
- Ubuntu 22.04 ARM
- MySQL 8.0 database
- .NET 8 runtime
- Nginx reverse proxy
- Systemd service for backend
- CloudWatch agent

### Deployment Scripts
- `setup.sh` - Initial setup and CDK bootstrap
- `deploy-backend.sh` - Deploy .NET backend to EC2
- `deploy-frontend.sh` - Deploy React frontend to S3/CloudFront
- `run-migration.sh` - Run database migrations
- `backup-database.sh` - Backup MySQL database

### Configuration Files
- `appsettings.Production.json` - Backend production config
- `.env.template` - Infrastructure configuration template
- `Dockerfile` - Backend containerization (optional)

## Estimated Monthly Cost: $18-24

Breakdown:
- EC2 t4g.small: ~$12/month
- EBS 30GB: ~$2.40/month
- S3 + CloudFront: ~$1-5/month
- Data transfer: ~$1-5/month

## Next Steps:

1. Review `QUICKSTART.md` for deployment steps
2. Read `DEPLOYMENT.md` for full documentation
3. Update `.env` with your passwords
4. Run `cd infrastructure && ./scripts/setup.sh`
5. Deploy with `npm run deploy`

## Important:
- TypeScript errors in CDK files are expected until you run `npm install`
- You'll need to set up SSH key pair for EC2 access, or use AWS Systems Manager
- Update connection strings and API endpoints before deploying
