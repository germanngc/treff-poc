#!/bin/bash
# Manual backend deployment script

set -e

INSTANCE_ID="i-09c99fb6242fd79a2"
REGION="us-east-2"
DEPLOYMENT_BUCKET="treff-deployments-prod"

echo "🚀 Manual Backend Deployment"
echo "=============================="
echo ""

# Build backend
echo "📦 Building backend..."
cd "$(dirname "$0")/../apps/backend/WebApi"
dotnet publish -c Release -o ./publish
cd publish
tar -czf backend.tar.gz *
echo "✅ Backend built successfully"
echo ""

# Upload to S3
echo "☁️  Uploading to S3..."
aws s3 cp backend.tar.gz s3://$DEPLOYMENT_BUCKET/backend.tar.gz --region $REGION
echo "✅ Uploaded to S3"
echo ""

# Deploy to EC2
echo "🔧 Deploying to EC2..."
COMMAND_ID=$(aws ssm send-command \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=[
    "set -e",
    "echo Downloading from S3...",
    "aws s3 cp s3://'"$DEPLOYMENT_BUCKET"'/backend.tar.gz /tmp/backend.tar.gz",
    "echo Stopping service...",
    "sudo systemctl stop treff-backend || true",
    "echo Cleaning old files...",
    "sudo rm -rf /var/www/treff-backend/*",
    "echo Extracting files...",
    "sudo tar -xzf /tmp/backend.tar.gz -C /var/www/treff-backend/",
    "sudo chown -R www-data:www-data /var/www/treff-backend/",
    "echo Starting service...",
    "sudo systemctl enable treff-backend",
    "sudo systemctl start treff-backend",
    "sleep 3",
    "sudo systemctl status treff-backend --no-pager",
    "rm /tmp/backend.tar.gz",
    "echo Deployment complete!"
  ]' \
  --region "$REGION" \
  --output text \
  --query 'Command.CommandId')

echo "Command ID: $COMMAND_ID"
echo "Waiting for deployment..."

# Wait for completion
for i in {1..60}; do
  STATUS=$(aws ssm get-command-invocation \
    --command-id "$COMMAND_ID" \
    --instance-id "$INSTANCE_ID" \
    --region "$REGION" \
    --query 'Status' \
    --output text 2>/dev/null || echo "Pending")
  
  echo "  Status: $STATUS"
  
  if [ "$STATUS" = "Success" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    aws ssm get-command-invocation \
      --command-id "$COMMAND_ID" \
      --instance-id "$INSTANCE_ID" \
      --region "$REGION" \
      --query 'StandardOutputContent' \
      --output text
    
    echo ""
    echo "🌐 Test the API:"
    echo "  curl https://d37tmm3aaqwvqg.cloudfront.net/api/v1/Product"
    exit 0
  elif [ "$STATUS" = "Failed" ]; then
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    aws ssm get-command-invocation \
      --command-id "$COMMAND_ID" \
      --instance-id "$INSTANCE_ID" \
      --region "$REGION" \
      --query '[StandardOutputContent,StandardErrorContent]' \
      --output text
    exit 1
  fi
  
  sleep 5
done

echo "⏱️  Timeout waiting for deployment"
exit 1
