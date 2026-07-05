# AWS S3 & CloudFront Frontend Deployment Documentation

This document describes the infrastructure and CI/CD workflow setup for deploying the React + TypeScript + Vite frontend application to AWS using Amazon S3 (Simple Storage Service) and Amazon CloudFront (Content Delivery Network).

---

## Architecture Overview

```mermaid
graph TD
    Developer[Developer] -- Push to main --> GitHub[GitHub Actions]

    subgraph CI [GitHub Actions Pipeline]
        Build[1. Install & Build] --> Sync[2. Deploy to S3]
        Sync --> Invalidate[3. Invalidate CloudFront]
    end

    GitHub --> Build
    Sync --> S3[Amazon S3 Bucket]
    Invalidate --> CF[Amazon CloudFront CDN]

    CF -- Origin Request --> S3

    EndUser[End User] -- Requests Website --> CF
    CF -- Serves Assets --> EndUser
```

All build processes (compiling TypeScript, compiling React components, optimization, and bundling) are handled entirely within GitHub Actions. The output `dist/` directory containing static files (HTML, JS, CSS, assets) is then uploaded directly to Amazon S3. CloudFront serves these files globally to end users.

---

## 1. Amazon S3

S3 hosts the built static files of the application. The bucket configuration parameters are:

- **Bucket Name:** `team1-proyect-frontend`
- **AWS Region:** `us-east-2` (Ohio)
- **Deployment Folder:** `dist/` (local output synced to root of S3 bucket)
- **AWS S3 Console Link:** [S3 Bucket team1-proyect-frontend](https://s3.console.aws.amazon.com/s3/buckets/team1-proyect-frontend?region=us-east-2)

### Deployment CLI Commands

- **Sync Local Assets to S3:**
  ```bash
  aws s3 sync dist/ s3://team1-proyect-frontend --delete
  ```
  _Note: The `--delete` flag is critical because it tells S3 to remove any files that no longer exist in the local `dist/` build directory, preventing obsolete bundle files from cluttering the bucket._

### Security & Access Policy (Standard S3 + CloudFront Best Practice)

To prevent direct public access to S3 (forcing users to go through the CloudFront CDN), the S3 bucket is configured with:

1. **Block Public Access:** All public access blocked.
2. **Bucket Policy:** Restricts read access (`s3:GetObject`) exclusively to the CloudFront distribution using an **Origin Access Control (OAC)** or **Origin Access Identity (OAI)**.

---

## 2. Amazon CloudFront CDN (Content Delivery Network)

CloudFront sits in front of the S3 bucket. It acts as a globally distributed proxy caching files at edge locations to minimize latency and manage SSL/TLS (HTTPS) termination.

- **Distribution ID:** `EZE32CTHKYHAK`
- **Origin Path:** Points to the `team1-proyect-frontend` S3 bucket.
- **AWS CloudFront Console Link:** [CloudFront Distribution EZE32CTHKYHAK](https://us-east-1.console.aws.amazon.com/cloudfront/v4/home#/distributions/EZE32CTHKYHAK)
- **Public URL / Domain Name:** [https://eze32cthkyhak.cloudfront.net](https://eze32cthkyhak.cloudfront.net) (or your mapped custom CNAME domain)

### Cache Invalidation

Whenever a new deployment runs, CloudFront edge caches must be evicted to ensure users receive the new code version immediately, rather than cached old versions.

- **Invalidation CLI Command:**
  ```bash
  aws cloudfront create-invalidation \
      --distribution-id EZE32CTHKYHAK \
      --paths "/*"
  ```

### SPA Routing & Custom Error Responses (Important)

Because this is a Single Page Application (SPA) utilizing client-side routing, directly hitting subroutes (e.g., `/stays`, `/bookings`) will cause S3 to return a `404 Not Found` (or `403 Forbidden` if access is restricted) since those folders do not exist physically in the bucket.

To support client-side routers:

- **CloudFront Custom Error Responses** must be configured:
  - **Error Code:** `404` and/or `403`
  - **Customize Error Response:** Yes
  - **Response Page Path:** `/index.html`
  - **HTTP Response Code:** `200` (OK)

This redirects all subroute requests back to the main `index.html` file, letting the React Router process and render the correct page view.

---

## 3. GitHub Actions CI/CD Pipeline

The workflow configuration is located in [.github/workflows/deploy-frontend.yml](file:///Users/russel69jjjas/Desktop/softserve/project_lab_frontend/.github/workflows/deploy-frontend.yml).

- **GitHub Workflow File Link:** [deploy-frontend.yml on GitHub](https://github.com/Russel-IV/project_lab_frontend/blob/main/.github/workflows/deploy-frontend.yml)
- **GitHub Actions Runs Link:** [Actions Page on GitHub](https://github.com/Russel-IV/project_lab_frontend/actions)

### Workflow Triggers

The deployment pipeline is automatically executed whenever code is pushed to the `main` branch.

### Pipeline Steps

1. **Checkout Repository:** Clones the codebase using `actions/checkout@v4`.
2. **Install pnpm:** Sets up `pnpm` (version 11) using `pnpm/action-setup@v3`.
3. **Setup Node.js:** Sets up Node.js (version 22) with `pnpm` package caching to optimize build times using `actions/setup-node@v4`.
4. **Install Dependencies:** Installs packages using `pnpm install --frozen-lockfile`.
5. **Build Application:** Compiles and bundles code with Vite (`pnpm build`).
6. **Local AWS CLI Install:** Only runs when executing the pipeline locally (checks if `env.ACT == 'true'`) to ensure standard AWS CLI dependencies are installed on the local runner.
7. **Configure AWS Credentials:** Configures AWS access via `aws-actions/configure-aws-credentials@v4` targeting the `us-east-2` region.
8. **Deploy to Amazon S3:** Synchronizes the `dist/` directory to the target bucket using `aws s3 sync --delete`.
9. **Invalidate CloudFront Cache:** Requests cache invalidation (`/*`) on the target distribution to make changes live immediately.

---

## 4. Required Repository Secrets

To enable the pipeline to authenticate with AWS and deploy changes, the following secrets must be set in the repository under **Settings > Secrets and variables > Actions**:

| Secret Name                      | Value Description                   | Example Value            |
| :------------------------------- | :---------------------------------- | :----------------------- |
| `AWS_ACCESS_KEY_ID`              | IAM deployment user access key      | `AKIAVQMIT7EKCHP2XVYL`   |
| `AWS_SECRET_ACCESS_KEY`          | IAM deployment user secret key      | `akeKnz6pi9WdhMxQ6MF...` |
| `AWS_S3_BUCKET_NAME`             | The name of the hosting S3 bucket   | `team1-proyect-frontend` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | The ID of the target CloudFront CDN | `EZE32CTHKYHAK`          |

---

## 5. Local Testing & Validation

The workflow is compatible with `act`, a tool to run GitHub Actions locally. The step `Install AWS CLI (local act only)` is explicitly designed to handle local CLI configuration.

To test the workflow locally:

1. Ensure `act` is installed.
2. Provide a local secrets file (e.g. `.secrets` or `.env` file containing the credentials listed above).
3. Run the workflow locally:
   ```bash
   act push -s AWS_ACCESS_KEY_ID=<VAL> -s AWS_SECRET_ACCESS_KEY=<VAL> ...
   ```
