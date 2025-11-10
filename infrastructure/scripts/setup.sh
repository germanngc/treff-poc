#!/bin/bash
set -e

echo "======================================"
echo "Treff AWS Infrastructure Setup"
echo "======================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "✓ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✓ npm: $(npm --version)"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install AWS CLI first."
    echo "   Visit: https://aws.amazon.com/cli/"
    exit 1
fi
echo "✓ AWS CLI: $(aws --version)"

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured."
    echo "   Run: aws configure"
    exit 1
fi
echo "✓ AWS credentials configured"

# Check CDK
if ! command -v cdk &> /dev/null; then
    echo ""
    echo "AWS CDK is not installed. Installing globally..."
    npm install -g aws-cdk
fi
echo "✓ AWS CDK: $(cdk --version)"

echo ""
echo "All prerequisites met!"
echo ""

# Install dependencies
echo "Installing CDK project dependencies..."
cd infrastructure
npm install
echo "✓ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.template .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit infrastructure/.env and update:"
    echo "   - MYSQL_ROOT_PASSWORD"
    echo "   - MYSQL_PASSWORD"
    echo "   - CDK_DEFAULT_ACCOUNT (your AWS account ID)"
    echo ""
    read -p "Press Enter to continue after updating .env file..."
fi

# Bootstrap CDK (if needed)
echo ""
echo "Checking CDK bootstrap status..."
if ! aws cloudformation describe-stacks --stack-name CDKToolkit &> /dev/null; then
    echo "CDK not bootstrapped. Bootstrapping now..."
    cdk bootstrap
    echo "✓ CDK bootstrapped"
else
    echo "✓ CDK already bootstrapped"
fi

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Review the infrastructure:"
echo "   cd infrastructure && npm run synth"
echo ""
echo "2. Deploy to AWS:"
echo "   npm run deploy"
echo ""
echo "3. After deployment, note the output values:"
echo "   - EC2PublicIP"
echo "   - CloudFrontURL"
echo "   - FrontendBucket"
echo "   - CloudFrontDistributionId"
echo ""
echo "4. Deploy your backend:"
echo "   ./scripts/deploy-backend.sh <EC2_IP> <SSH_KEY>"
echo ""
echo "5. Deploy your frontend:"
echo "   ./scripts/deploy-frontend.sh <S3_BUCKET> <CLOUDFRONT_ID>"
echo ""
echo "For detailed instructions, see infrastructure/README.md"
echo ""
