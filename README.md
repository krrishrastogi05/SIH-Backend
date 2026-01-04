This is the backend service for the Smart India Hackathon project. It is a robust, modular REST API built with **Node.js**, **Express**, and **TypeScript**, designed to manage government schemes, beneficiary eligibility, and officer operations.

It features a background job processing system using **Redis** and **BullMQ** to handle high-load tasks like eligibility checks and notifications asynchronously.

## 🚀 Features

* **Authentication & Authorization**: Secure JWT-based authentication with Role-Based Access Control (RBTc) for `BENEFICIARY` and `OFFICER` roles.
* **Scheme Management**: Officers can create schemes with dynamic eligibility criteria (JSON-based rules).
* **Eligibility Engine**: Automated background processing to match beneficiaries with schemes based on income, age, gender, education, and location.
* **Beneficiary Profile**: Users can manage their profiles, which are automatically vetted against schemes.
* **Job Queues**: Uses Redis and BullMQ for decoupled, scalable processing of eligibility scans and SMS notifications.
* **Database**: PostgreSQL with Prisma ORM for type-safe database interactions.
* **Modular Architecture**: Code is organized by feature (Auth, Beneficiary, Officer, Schemes) for scalability.

## JB Tech Stack

* **Runtime**: Node.js
* **Language**: TypeScript
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Queue/Caching**: Redis, BullMQ
* **Validation**: Zod
* **Authentication**: JSON Web Tokens (JWT), Bcrypt



## 🏗️ System Architecture
![System Architecture](./assets/architecture.svg)
## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (Running locally or via cloud)
3. **Redis** (Required for the worker queues)

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd sih-backend

```


2. **Install Dependencies**
```bash
npm install

```


*Note: If you face dependency conflicts (e.g., multer/cloudinary), use `npm install --legacy-peer-deps`.*
3. **Environment Configuration**
Create a `.env` file in the root directory and configure the following variables:
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/sih_db?schema=public"

# Redis (For Queues)
REDIS_URL="redis://127.0.0.1:6379"

# Security
JWT_SECRET="your_super_secret_jwt_key"

```


4. **Database Setup (Prisma)**
Generate the Prisma client and push the schema to your database:
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to DB (Dev mode)
npx prisma db push

```


5. **Seed the Database (Optional)**
Populate the DB with test users (Officer and Beneficiaries):
```bash
npm runZF seed

```



## wc Running the Application

This system consists of two parts: the **API Server** and the **Worker** (for background tasks).

### Development Mode

You can run them in separate terminals:

**1. Start the API Server:**

```bash
npm run dev

```

*Server runs on `http://localhost:8000*`

**2. Start the Background Worker:**

```bash
npx tsx src/workers/unifiedWorker.ts

```

### Production Build

```bash
npm run build
npm start

```

## 📡 API Endpoints Overview

### **Auth Module**

* `POST /api/auth/register` - Register a new user.
* `POST /api/auth/login` - Login and receive JWT.

### **Beneficiary Module**

* `GET /api/beneficiary/profile` - Get current user details.
* `PUT /api/beneficiary/profile` - Update profile (triggers eligibility checks in logic).
* `GET /api/beneficiary/dashboard` - View eligible schemes (Planned).

### **Officer Module** (Role: OFFICER only)

* `POST /api/officer/schemes` - Create a new scheme.
* *Triggers a background job to scan all users for eligibility.*


* `GET /api/officer/schemes/:id/applications` - View applications for a scheme.
* `POST /api/officer/payment/initiate` - Process payments for beneficiaries.

### **Schemes Module**

* `GET /api/schemes` - List all public schemes (supports filters like `state`, `type`).
* `GET /api/schemes/:id` - Get details of a specific scheme.

## 📂 Project Structure

```text
src/
├── app.ts                  # Express App Setup (Middleware, CORS)
├── server.ts               # Server Entry Point
├── config/                 # Environment Variables
├── db/                     # Prisma Client Instance
├── middlewares/            # Auth and Role Middlewares
├── modules/                # Feature-based Modules
│   ├── auth/               # Login/Register Logic
│   ├── beneficiary/        # Beneficiary Profile & Logic
│   ├── officer/            # Officer Actions (Create Scheme, Payment)
│   └── schemes/            # Scheme Catalog
├── queue/                  # BullMQ Queue Setup
├── utils/                  # Helpers (Eligibility Engine)
└── workers/                # Background Workers (UnifiedWorker)

```

## 📝 Developer Notes

* **Imports**: Always use `.js` extension for local imports (e.g., `import { x } from "./file.js"`).
* **Prisma**: Do not instantiate `new PrismaClient()` in controllers. Use the singleton instance from `src/db/prisma.ts`.
* **Queues**: The `unifiedWorker.ts` handles tasks like `check-eligibility-for-scheme` and `send-sms`. Ensure Redis is running for these to work.
