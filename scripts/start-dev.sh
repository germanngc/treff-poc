#!/bin/bash

# Development startup script for Treff monorepo

echo "🚀 Starting Treff Development Environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check .NET
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK is not installed"
    exit 1
fi
echo "✅ .NET $(dotnet --version)"

# Check DFX (for ICP)
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX is not installed (needed for ICP development)"
    echo "💡 Install with: sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
    exit 1
fi
echo "✅ DFX $(dfx --version)"

# Check MySQL (optional for local development)
if ! brew services list | grep mysql | grep started &> /dev/null; then
    echo "⚠️  MySQL is not running. Some backend features may not work."
    echo "💡 Start with: brew services start mysql"
fi

echo ""
echo "🔧 Setting up environment..."

# Install dependencies
npm install

echo ""
echo "🌐 Starting applications..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000 (Swagger: /swagger)"
echo "⛓️  ICP: http://localhost:8080"
echo ""

# Start all services
npm run dev