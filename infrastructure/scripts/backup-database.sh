#!/bin/bash
set -e

echo "================================"
echo "Database Backup Script"
echo "================================"
echo ""

# Configuration
EC2_IP="${1:-}"
SSH_KEY="${2:-~/.ssh/treff-key.pem}"
BACKUP_DIR="${3:-./backups}"

if [ -z "$EC2_IP" ]; then
    echo "Error: EC2 IP address is required"
    echo "Usage: ./backup-database.sh <EC2_IP> [SSH_KEY_PATH] [BACKUP_DIR]"
    echo "Example: ./backup-database.sh 54.123.45.67 ~/.ssh/treff-key.pem ./backups"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="treff_v2_backup_$(date +%Y%m%d_%H%M%S).sql.gz"

echo "EC2 IP: $EC2_IP"
echo "SSH Key: $SSH_KEY"
echo "Backup Directory: $BACKUP_DIR"
echo "Backup File: $BACKUP_FILE"
echo ""

# Step 1: Create backup on EC2
echo "Step 1/2: Creating database backup on EC2..."
ssh -i "$SSH_KEY" ubuntu@$EC2_IP << ENDSSH
    set -e
    mysqldump -utreff_user -p treff_v2 | gzip > /tmp/$BACKUP_FILE
    echo "✓ Backup created on EC2"
ENDSSH
echo ""

# Step 2: Download backup
echo "Step 2/2: Downloading backup..."
scp -i "$SSH_KEY" ubuntu@$EC2_IP:/tmp/$BACKUP_FILE "$BACKUP_DIR/"
echo "✓ Backup downloaded"
echo ""

# Cleanup
echo "Cleaning up remote backup..."
ssh -i "$SSH_KEY" ubuntu@$EC2_IP "rm /tmp/$BACKUP_FILE"
echo ""

echo "================================"
echo "Backup Complete!"
echo "================================"
echo "Backup saved to: $BACKUP_DIR/$BACKUP_FILE"
echo ""
echo "To restore:"
echo "gunzip < $BACKUP_DIR/$BACKUP_FILE | mysql -utreff_user -p treff_v2"
echo ""
