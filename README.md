# Treff Platform - Monorepo

A comprehensive freelancer marketplace platform built with .NET Core, React, and Internet Computer Protocol (ICP).

## 🏗️ Architecture

```
treff-monorepo/
├── apps/
│   ├── backend/         # .NET Core Web API (Clean Architecture)
│   ├── frontend/        # React.js Frontend
│   └── icp/            # Internet Computer Protocol Integration
├── infrastructure/     # AWS CDK Infrastructure (NEW!)
│   ├── bin/           # CDK app entry
│   ├── lib/           # Infrastructure stacks
│   └── scripts/       # Deployment automation
├── packages/           # Shared packages and utilities
├── scripts/           # Build and deployment scripts
├── shared/           # Shared types and utilities
└── docs/            # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 16.0.0
- **.NET SDK** >= 9.0.0
- **DFX** (for ICP development)
- **Docker** (optional, for local services)

### Development Setup

1. **Clone and setup the repository:**
   ```bash
   git clone <repository-url>
   cd treff-poc
   npm run setup
   ```

2. **Install Entity Framework CLI tools:**
   ```bash
   dotnet tool install --global dotnet-ef
   ```

3. **Start local services:**
   ```bash
   npm run docker:up  # Starts MySQL and other services
   ```

4. **Setup database schema:**
   ```bash
   cd apps/backend/WebApi
   dotnet ef database update  # Creates tables in MySQL
   ```

5. **Start all applications in development mode:**
   ```bash
   npm run dev
   ```

This will start:
- 📱 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:5000 (Swagger: http://localhost:5000/swagger)
- ⛓️  **ICP**: http://localhost:8080

## 📱 Applications

### Backend (.NET Core)
- **Framework**: ASP.NET Core 9.0
- **Architecture**: Clean Architecture with CQRS
- **Database**: MySQL with Entity Framework Core
- **Features**: 
  - RESTful API
  - SignalR for real-time communication
  - JWT Authentication
  - Swagger documentation

### Frontend (React)
- **Framework**: React 18.2.0
- **State Management**: Redux Toolkit
- **UI Libraries**: Material-UI, Bulma, PrimeReact
- **Build Tool**: Create React App
- **Features**:
  - Responsive design
  - Real-time chat
  - Payment integration
  - File uploads

### ICP (Internet Computer)
- **Backend**: Motoko canisters
- **Frontend**: React with Vite
- **Features**:
  - Decentralized storage
  - Blockchain integration
  - Identity management

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                 # Start all apps in dev mode
npm run dev:frontend       # Start only frontend
npm run dev:backend        # Start only backend
npm run dev:icp            # Start only ICP

# Building
npm run build              # Build all applications
npm run build:frontend     # Build frontend only
npm run build:backend      # Build backend only
npm run build:icp          # Build ICP only

# Testing
npm run test               # Run all tests
npm run test:backend       # Run backend tests only

# Utilities
npm run clean              # Clean all build artifacts
npm run setup              # Setup dependencies and ICP
```

### Local Services

Start local MySQL and Redis using Docker:

```bash
npm run docker:up    # Start services
npm run docker:down  # Stop services
```

Services:
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

### Database Setup

The backend uses MySQL with Entity Framework Core. Follow these steps for local development:

#### 1. Start MySQL Database
```bash
# Option A: Use Docker (recommended)
npm run docker:up

# Option B: Start MySQL manually
docker run --name treff-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=treff_v2 -p 3306:3306 -d mysql:8.0
```

#### 2. Install Entity Framework CLI Tools
```bash
dotnet tool install --global dotnet-ef
```

#### 3. Run Database Migrations
```bash
cd apps/backend/WebApi
dotnet ef migrations list                    # Check existing migrations
dotnet ef migrations add InitialCreate      # Create migration (if needed)
dotnet ef database update                   # Apply migrations to database
```

#### 4. Verify Database Setup
Test the API endpoint to ensure tables are created:
```bash
# Start backend
npm run dev:backend

# Test API (in separate terminal)
curl -k -i https://localhost:5001/api/v1/Product
```

#### Connection String
Update `apps/backend/WebApi/appsettings.json` with your database connection:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=treff_v2;Uid=root;Pwd=password;"
  }
}
```

#### Common Issues
- **Table doesn't exist**: Run `dotnet ef database update`
- **Connection failed**: Check MySQL is running and credentials are correct
- **SSL issues**: Use HTTP endpoint `http://localhost:5000/api/v1/Product` or ignore SSL with `-k` flag

## 🏗️ Building for Production

```bash
# Build all applications
./scripts/build.sh

# Or build individually
npm run build:frontend
npm run build:backend
npm run build:icp
```

## 🚀 Deployment

### ☁️ AWS Deployment (Recommended - Budget-Friendly)

Complete AWS CDK infrastructure for deploying to AWS (~$18-24/month):

- **Frontend**: S3 + CloudFront (global CDN with HTTPS)
- **Backend + Database**: EC2 t4g.small with .NET + MySQL + Nginx
- **Cost**: Only $18-24/month (or $7-15/month with AWS free tier)

**Quick Start:**
```bash
cd infrastructure
npm install
cp .env.template .env
# Edit .env with your passwords
cdk bootstrap
npm run deploy
```

**📚 Documentation:**
- **[AWS-INFRASTRUCTURE.md](./docs/AWS-INFRASTRUCTURE.md)** - Complete overview
- **[QUICKSTART.md](./docs/QUICKSTART.md)** - 5-step deployment guide
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Detailed instructions
- **[DEPLOYMENT-CHECKLIST.md](./docs/DEPLOYMENT-CHECKLIST.md)** - Track your progress

**Features:**
- ✅ Complete infrastructure as code (AWS CDK)
- ✅ Automated deployment scripts
- ✅ Database backup utilities
- ✅ Cost-optimized architecture
- ✅ Production-ready with monitoring

### Alternative Deployment Options

**Frontend (React)**
- Build output: `apps/frontend/build/`
- Deploy to: Vercel, Netlify, AWS S3, etc.

**Backend (.NET)**
- Build output: `apps/backend/WebApi/bin/Release/net9.0/`
- Deploy to: Azure App Service, AWS ECS, Docker containers

**ICP**
- Deploy to Internet Computer network
- Use `dfx deploy --network ic` for mainnet

## 🔧 Configuration

### Environment Variables

Create `.env` files in each application directory:

**Frontend (`apps/frontend/.env`)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SIGNALR_URL=http://localhost:5000
```

**Backend (`apps/backend/WebApi/appsettings.Development.json`)**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=treff_v2;Uid=root;Pwd=root;"
  }
}
```

## 📚 Documentation

### AWS Deployment
- [AWS Infrastructure Overview](./docs/AWS-INFRASTRUCTURE.md)
- [Quick Start Guide](./docs/QUICKSTART.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Deployment Checklist](./docs/DEPLOYMENT-CHECKLIST.md)
- [Setup Complete Notes](./docs/SETUP-COMPLETE.md)

### Development
- [API Documentation](./docs/api.md) _(Coming soon)_
- [Frontend Guide](./docs/frontend.md) _(Coming soon)_
- [Backend Architecture](./docs/backend.md) _(Coming soon)_
- [ICP Integration](./docs/icp.md) _(Coming soon)_

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

## � Troubleshooting

### Frontend Issues
- **White screen**: Check browser console for React errors, verify API connectivity
- **React hook errors**: Ensure consistent React versions across all packages
- **Network errors**: Verify backend is running and CORS is configured

### Backend Issues
- **dotnet ef not found**: Run `dotnet tool install --global dotnet-ef`
- **Database connection failed**: Check MySQL is running and connection string is correct
- **Table doesn't exist**: Run `dotnet ef database update` to apply migrations
- **SSL certificate issues**: Use HTTP endpoint or trust development certificate

### Database Issues
- **MySQL not starting**: Check port 3306 is available: `lsof -i :3306`
- **Access denied**: Verify MySQL credentials in connection string
- **Database doesn't exist**: Create manually or let migrations create it

### Docker Issues
- **Port already in use**: Stop conflicting services or change port mappings
- **Container won't start**: Check Docker is running: `docker --version`

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Tech Stack**: React • .NET Core • MySQL • Redis • Internet Computer • Docker