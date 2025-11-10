#!/bin/bash
set -e

echo "================================"
echo "Treff Frontend Deployment Script"
echo "================================"
echo ""

# Configuration
BUCKET_NAME="${1:-}"
DISTRIBUTION_ID="${2:-}"
FRONTEND_DIR="../apps/frontend"

if [ -z "$BUCKET_NAME" ]; then
    echo "Error: S3 bucket name is required"
    echo "Usage: ./deploy-frontend.sh <S3_BUCKET_NAME> [CLOUDFRONT_DISTRIBUTION_ID]"
    echo "Example: ./deploy-frontend.sh treff-frontend-123456789 E1234567890ABC"
    exit 1
fi

echo "S3 Bucket: $BUCKET_NAME"
echo "CloudFront Distribution: ${DISTRIBUTION_ID:-N/A}"
echo "Frontend Directory: $FRONTEND_DIR"
echo ""

# Step 1: Build the application
echo "Step 1/3: Building React application..."
cd "$FRONTEND_DIR"
npm run build
echo "✓ Build complete"
echo ""

# Step 2: Upload to S3
echo "Step 2/3: Uploading to S3..."
aws s3 sync build/ s3://$BUCKET_NAME/ --delete
echo "✓ Upload complete"
echo ""

# Step 3: Invalidate CloudFront cache
if [ -n "$DISTRIBUTION_ID" ]; then
    echo "Step 3/3: Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    echo "✓ Cache invalidation initiated"
else
    echo "Step 3/3: Skipping CloudFront invalidation (no distribution ID provided)"
fi
echo ""

echo "================================"
echo "Deployment Complete!"
echo "================================"
echo "Frontend deployed to: s3://$BUCKET_NAME"
if [ -n "$DISTRIBUTION_ID" ]; then
    echo "CloudFront URL: https://$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"
fi
echo ""
echo "Note: CloudFront invalidation may take 5-10 minutes to complete"
echo ""

cd ../..
