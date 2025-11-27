#!/bin/bash
# Helper script to check backend status on EC2

INSTANCE_ID="i-09c99fb6242fd79a2"
REGION="us-east-2"

echo "🔍 Checking backend status on EC2..."
echo ""

# Send SSM command to check status
COMMAND_ID=$(aws ssm send-command \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=[
    "echo === Backend Files ===",
    "ls -lah /var/www/treff-backend/ | head -20",
    "echo",
    "echo === Service Status ===",
    "sudo systemctl status treff-backend --no-pager || echo Service not found",
    "echo",
    "echo === Recent Logs ===",
    "sudo journalctl -u treff-backend -n 30 --no-pager || echo No logs",
    "echo",
    "echo === Nginx Status ===",
    "sudo systemctl status nginx --no-pager",
    "echo",
    "echo === Test Local API ===",
    "curl -s http://localhost/api/v1/Product || echo API not responding"
  ]' \
  --region "$REGION" \
  --output text \
  --query 'Command.CommandId')

echo "Command ID: $COMMAND_ID"
echo "Waiting for results..."
sleep 5

# Get command output
aws ssm get-command-invocation \
  --command-id "$COMMAND_ID" \
  --instance-id "$INSTANCE_ID" \
  --region "$REGION" \
  --query 'StandardOutputContent' \
  --output text

echo ""
echo "✅ Check complete!"
echo ""
echo "To manually deploy backend:"
echo "  cd /Users/german/VSCode/treff/treff-poc"
echo "  ./scripts/deploy-backend-manual.sh"
