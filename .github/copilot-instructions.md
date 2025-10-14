# Guiding Principles for AI Coding Agents in the Amazon Q Business Tools Project

This document provides essential knowledge to help AI agents contribute effectively to this codebase.

## The Big Picture: Architecture Overview

This is a monorepo containing a full-stack application designed to interact with Amazon Q Business. The architecture is composed of three main parts:

1.  **`frontend/`**: A React single-page application (SPA) built with TypeScript and TailwindCSS. This is the user-facing component.
2.  **`backend/typescript/`**: A NestJS (TypeScript) backend API. It serves as a proxy and orchestration layer between the frontend and various AWS services. **Note:** The root `README.md` incorrectly mentions a Python backend; the authoritative backend is the NestJS implementation in `backend/typescript/`.
3.  **`infra/`**: An AWS CDK project (in TypeScript) that defines and deploys the entire cloud infrastructure, including services like S3, CloudFront, ECS, and Cognito.

The primary data flow is: `React Frontend` -> `NestJS Backend API` -> `Amazon Q Business & other AWS Services`.

## Developer Workflows

### Local Development

To run the full application locally, you need to start both the frontend and backend services.

**1. Backend Setup:**
The backend requires environment variables for configuration.

```bash
# Navigate to the backend directory
cd backend/typescript

# Create a .env file with the necessary AWS and application settings.
# See backend/typescript/README.md for required variables like AWS_REGION.
# Example:
# AWS_REGION=us-east-1
# PORT=8000
# ... other variables

# Install dependencies and start the development server
npm install
npm run start:dev
```

**2. Frontend Setup:**

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies and start the development server
npm install
npm start
```

The frontend will be available at `http://localhost:3000` and will connect to the backend running on port 8000.

### Deployment

Deployment to AWS is managed by the CDK project in the `infra/` directory. The process involves deploying multiple stacks in a specific order.

A key part of the deployment is the `infra/deploy.sh` script, which automates building the frontend, uploading assets to S3, and configuring API URLs.

The general deployment flow is:

1.  `cd infra`
2.  `npm install`
3.  Run a series of `npx cdk deploy ...` commands as detailed in the root `README.md`. The `deploy.sh` script is executed in the middle of this process.

## Key Components & Patterns

### Authentication

Authentication is a critical and complex feature. The application supports multiple methods:

- **AWS Credentials**: For direct AWS API access, primarily used in the Operations Dashboard.
- **Amazon Cognito**: For user authentication via User Pools.
- **IAM Identity Center**: For enterprise-grade SSO and trusted identity propagation.

When working on features that require user-level permissions (like Chat or Unified Search), you must consider the authentication context. The frontend stores auth configuration in the browser's local storage.

### Frontend Service Layer

All interactions with the backend API and AWS services from the frontend are centralized in the service layer located at `frontend/src/services/`. When adding a new feature that communicates with the backend, you should add or update a service in this directory.

### Infrastructure as Code (IaC)

The `infra/lib/` directory contains the CDK stack definitions. This is the source of truth for the entire cloud architecture.

- `backend-stack.ts`: Defines the ECS Fargate service, ALB, and VPC for the backend.
- `cloudront-stack.ts` (likely a typo in the file tree, should be `cloudfront-stack.ts`): Defines the S3 bucket and CloudFront distribution for the frontend.
- `cognito-stack.ts`: Defines the Cognito User Pool for authentication.
- `create-iam-idc-app.ts`: Handles the creation of the IAM Identity Center application.
- `update-iam-idc-app.ts`: Handles updates to the IAM Identity Center application configuration.

When making changes that require new cloud resources or permissions, you must update the CDK stacks here.
