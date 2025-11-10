#!/bin/bash
set -e

echo "================================"
echo "Treff Backend Deployment Script"
echo "================================"
echo ""

# Configuration
EC2_IP="${1:-}"
SSH_KEY="${2:-~/.ssh/treff-key.pem}"
BACKEND_DIR="../apps/backend/WebApi"

if [ -z "$EC2_IP" ]; then
    echo "Error: EC2 IP address is required"
    echo "Usage: ./deploy-backend.sh <EC2_IP> [SSH_KEY_PATH]"
    echo "Example: ./deploy-backend.sh 54.123.45.67 ~/.ssh/treff-key.pem"
    exit 1
fi

echo "EC2 IP: $EC2_IP"
echo "SSH Key: $SSH_KEY"
echo "Backend Directory: $BACKEND_DIR"
echo ""

# Step 1: Build the application
echo "Step 1/5: Building .NET application..."
cd "$BACKEND_DIR"
dotnet publish -c Release -o ./publish
echo "✓ Build complete"
echo ""

# Step 2: Create deployment package
echo "Step 2/5: Creating deployment package..."
cd publish
tar -czf backend.tar.gz *
echo "✓ Package created"
echo ""

# Step 3: Upload to EC2
echo "Step 3/5: Uploading to EC2..."
scp -i "$SSH_KEY" backend.tar.gz ubuntu@$EC2_IP:/tmp/
echo "✓ Upload complete"
echo ""

# Step 4: Deploy on EC2
echo "Step 4/5: Deploying on EC2..."
ssh -i "$SSH_KEY" ubuntu@$EC2_IP << 'ENDSSH'
    set -e
    
    echo "Stopping backend service..."
    sudo systemctl stop treff-backend || true
    
    echo "Extracting new version..."
    sudo rm -rf /var/www/treff-backend/*
    sudo tar -xzf /tmp/backend.tar.gz -C /var/www/treff-backend/
    
    echo "Setting permissions..."
    sudo chown -R www-data:www-data /var/www/treff-backend/
    
    echo "Starting backend service..."
    sudo systemctl enable treff-backend
    sudo systemctl start treff-backend
    
    echo "Cleaning up..."
    rm /tmp/backend.tar.gz
    
    echo "Waiting for service to start..."
    sleep 5
    
    echo "Service status:"
    sudo systemctl status treff-backend --no-pager
ENDSSH

echo "✓ Deployment complete"
echo ""

# Step 5: Verify
echo "Step 5/5: Verifying deployment..."
sleep 2
curl -s -o /dev/null -w "%{http_code}" http://$EC2_IP/api/v1/Product || true
echo ""
echo ""

echo "================================"
echo "Deployment Complete!"
echo "================================"
echo "Backend URL: http://$EC2_IP"
echo "Swagger: http://$EC2_IP/swagger"
echo ""
echo "To view logs:"
echo "ssh -i $SSH_KEY ubuntu@$EC2_IP 'sudo journalctl -u treff-backend -f'"
echo ""

# Cleanup
cd ../..
rm -f publish/backend.tar.gz
