#!/bin/bash
set -e

echo "================================"
echo "Database Migration Script"
echo "================================"
echo ""

# Configuration
EC2_IP="${1:-}"
SSH_KEY="${2:-~/.ssh/treff-key.pem}"
SQL_FILE="${3:-}"

if [ -z "$EC2_IP" ] || [ -z "$SQL_FILE" ]; then
    echo "Error: EC2 IP and SQL file are required"
    echo "Usage: ./run-migration.sh <EC2_IP> <SQL_FILE> [SSH_KEY_PATH]"
    echo "Example: ./run-migration.sh 54.123.45.67 migration.sql ~/.ssh/treff-key.pem"
    exit 1
fi

if [ ! -f "$SQL_FILE" ]; then
    echo "Error: SQL file not found: $SQL_FILE"
    exit 1
fi

echo "EC2 IP: $EC2_IP"
echo "SSH Key: $SSH_KEY"
echo "SQL File: $SQL_FILE"
echo ""

# Step 1: Upload SQL file
echo "Step 1/2: Uploading SQL file..."
scp -i "$SSH_KEY" "$SQL_FILE" ubuntu@$EC2_IP:/tmp/migration.sql
echo "✓ Upload complete"
echo ""

# Step 2: Run migration
echo "Step 2/2: Running migration..."
ssh -i "$SSH_KEY" ubuntu@$EC2_IP << 'ENDSSH'
    set -e
    
    echo "Backing up database..."
    sudo mysqldump -utreff_user -p treff_v2 > /tmp/backup_$(date +%Y%m%d_%H%M%S).sql
    
    echo "Running migration..."
    sudo mysql -utreff_user -p treff_v2 < /tmp/migration.sql
    
    echo "Cleaning up..."
    rm /tmp/migration.sql
    
    echo "Migration complete!"
ENDSSH

echo "✓ Migration complete"
echo ""
echo "================================"
echo "Migration Complete!"
echo "================================"
