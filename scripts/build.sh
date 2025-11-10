#!/bin/bash

# Build script for all applications in the monorepo

set -e

echo "🏗️  Building Treff Monorepo..."

# Build .NET Backend
echo "🔧 Building Backend (.NET)..."
cd apps/backend
dotnet clean
dotnet restore
dotnet build --configuration Release
cd ../..

# Build Frontend (React)
echo "📱 Building Frontend (React)..."
npm run build --workspace=apps/frontend

# Build ICP
echo "⛓️  Building ICP..."
cd apps/icp
if [ ! -f ".dfx/local/canister_ids.json" ]; then
    echo "📦 Setting up ICP canisters..."
    dfx start --background --clean
    dfx deploy
fi
npm run build --workspace=src/treff-icp-frontend
cd ../..

echo "✅ All applications built successfully!"
echo ""
echo "📦 Build outputs:"
echo "   Backend: apps/backend/WebApi/bin/Release/net9.0/"
echo "   Frontend: apps/frontend/build/"
echo "   ICP: apps/icp/src/treff-icp-frontend/dist/"