# Mini ERP + CRM Operations Portal

![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)

A complete full-stack web application designed for wholesale and distribution companies. This portal handles Customer CRM, Product & Inventory Management, Sales Challans, Invoices, Purchase Orders, and robust Authentication with role-based access control.

This project was developed for a Full-Stack Developer Case Study. It strictly adheres to all specified guidelines, demonstrating architecture, clean APIs, a responsive frontend, and deployment strategies.

## 🚀 Live Links
- **Frontend (Live App):** [https://mini-erp-crm-orpin.vercel.app](https://mini-erp-crm-orpin.vercel.app)
- **Backend API Base URL:** [https://mini-erp-crm-ftfk.vercel.app](https://mini-erp-crm-ftfk.vercel.app)

---

## Features & Core Modules

### 1. Authentication & Roles
- **JWT-based Authentication**: Secure endpoints guarded by middleware.
- **Roles**: `ADMIN`, `SALES`, `WAREHOUSE`, and `ACCOUNTS`. The frontend dynamically adjusts navigation and permissions based on the active role.

### 2. Customer CRM
- **Management**: Add, edit, search, and view customers.
- **Fields**: Captures Name, Mobile, Email, Business Name, GST, Customer Type (Retail/Wholesale/Distributor), Address, Status, and Follow-up Dates.
- **CRM Features**: Users can attach timestamped follow-up notes to specific customer profiles.

### 3. Product & Inventory
- **Management**: Track product details including SKU, Category, Unit Price, and Minimum Stock Alerts.
- **Stock Movement Log**: A historical log that tracks whenever stock is adjusted (Quantity, IN/OUT, Reason, Timestamp, Created By).

### 4. Sales Challan Flow
- **Generation**: Create multi-product sales challans tied to specific customers. Automatically generates unique Challan numbers.
- **Business Logic**: Marking a challan as `CONFIRMED` automatically deducts the respective quantities from the inventory. It safely validates that stock cannot go negative.
- **Snapshot Storage**: When a challan is generated, product prices and details are snapshot in the database to preserve historical accuracy even if the original product is deleted/modified later.

---

## Tech Stack & Architecture

### Backend (Node.js + Express + TypeScript)
- **Framework**: Express.js with TypeScript for type-safety.
- **Database**: PostgreSQL (Hosted on Supabase).
- **ORM**: Prisma for schema management, migrations, and extremely optimized database querying (e.g. leveraging native `COUNT(*)` for dashboard statistics).
- **Validation**: Zod schema validation ensures data integrity on all incoming API requests.
- **Global Exception Handling**: A centralized error handling middleware prevents the server from crashing, intercepting Prisma and Zod errors to return structured JSON responses.

### Frontend (React + TypeScript)
- **Framework**: React via Vite.
- **Styling**: Custom responsive CSS utilizing Flexbox/Grid for a mobile-friendly experience (including a collapsible hamburger sidebar).
- **State & Routing**: `react-router-dom` and React Context for Auth state.
- **Resilience**: Implements React `<ErrorBoundary>` and Axios interceptors to gracefully catch UI and 500-level API errors without white-screening the app.

---

## Setup & Local Execution

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Either installed locally, hosted on Supabase, or run via Docker)
- Docker & Docker Compose (Optional: For local isolated database)

### Environment Variables
This project strictly utilizes environment variables to ensure secrets (like database credentials and JWT keys) are never hardcoded. Both the `backend` and `frontend` directories require their own `.env` files to function.

### 1. Clone the Repository
```bash
git clone https://github.com/jonnalagaddalakshmisaimadhu/mini-ERP-CRM-.git
cd mini-ERP-CRM-
```

### 2. (Optional) Run Database via Docker
If you do not want to use the live Supabase cloud database, you can spin up a local PostgreSQL instance instantly using the provided `docker-compose.yml` file:
```bash
docker-compose up -d
```
*This will start a Postgres DB on port 5432 with the credentials defined in the compose file.*

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
JWT_SECRET=super_secret_jwt_key
# Use Supabase URL or the Local Docker URL: postgresql://erp_user:erp_password@localhost:5432/erp_db
DATABASE_URL="postgresql://postgres.wtzylsylntqjymnhqlyi:Madhu63030@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.wtzylsylntqjymnhqlyi:Madhu63030@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```
Run Database Migrations and start the server:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

---

## Test Login Credentials

Use the following credentials to test the various Role-Based Access Controls (RBAC) in the system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@test.com | password123 |
| **Sales** | sales@test.com | password123 |
| **Warehouse** | warehouse@test.com | password123 |
| **Accounts** | accounts@test.com | password123 |

---

## API Documentation
A complete **Postman Collection** is provided in the repository (`mini_erp_postman_collection.json`). You can import this directly into Postman to review and test all backend endpoints (Auth, Customers, Products, Challans, Invoices, Purchase Orders).

### API Overview
- `POST /api/auth/login`
- `GET /api/customers`, `POST /api/customers`, `PUT /api/customers/:id`
- `POST /api/customers/:id/notes`
- `GET /api/products`, `POST /api/products`
- `GET /api/challans`, `POST /api/challans`

*All APIs include standard HTTP status codes (200, 201, 400, 401, 404, 500) and strict Zod validation errors.*

---

## Known Limitations / Assumptions
- **Pagination**: While the database queries are optimized, large-scale data tables in the UI currently use scroll-based viewing instead of hard page-number pagination.
- **Image Uploads**: Uploading product images to AWS S3 was scoped as a bonus feature and is mocked via placeholder UI logic.

---

## Testing Verification
The platform includes automated testing frameworks.
- **Backend**: `npm run test` (Jest / Supertest integration testing)
- **Frontend**: `npm run test` (Vitest / React Testing Library component testing)

---

## 🏗️ Project Architecture & File Structure

The application is built using a modern **Monorepo** structure, splitting the Frontend and Backend into separate concerns while keeping them in the same repository for easy version control.

### Backend (`/backend`)
Handles the REST API, database connections, and business logic.
- **`src/server.ts` / `src/app.ts`**: The main entry points. `app.ts` configures Express middlewares and routes, while `server.ts` starts the listener.
- **`src/db.ts`**: Initializes the Prisma Client for database communication.
- **`src/controllers/`**: Contains the core business logic for each feature (e.g., `authController.ts`, `customerController.ts`, `challanController.ts`).
- **`src/routes/`**: Maps API endpoints to their respective controllers (e.g., `authRoutes.ts`, `customerRoutes.ts`).
- **`src/middleware/`**: Custom middleware functions. `auth.ts` verifies JWT tokens and checks RBAC roles, `errorHandler.ts` handles global API errors securely.
- **`prisma/schema.prisma`**: The database schema defining all tables (User, Customer, Product, Challan, Invoice, etc.) and their relationships.
- **`vercel.json`**: Serverless configuration to deploy the Node.js backend seamlessly on Vercel.

### Frontend (`/frontend`)
The React user interface.
- **`src/main.tsx`**: React entry point and root rendering.
- **`src/App.tsx`**: Defines the `react-router-dom` routes and wraps the application in the AuthProvider.
- **`src/context/AuthContext.tsx`**: Global state management for user authentication and role validation.
- **`src/components/`**: Reusable UI components.
  - **`Layout.tsx`**: The main dashboard shell (Sidebar + Header + Content Area).
  - **`Sidebar.tsx`**: Dynamic navigation menu based on user roles.
  - **`ProtectedRoute.tsx`**: Route guard that blocks unauthorized access.
- **`src/pages/`**: The main view for each route (e.g., `Dashboard.tsx`, `Customers.tsx`, `Products.tsx`, `Challans.tsx`).
- **`src/services/api.ts`**: Axios instance configured with Interceptors to automatically attach JWT tokens to every outgoing request.

---

## 🔄 Design of Workflow (Core Features)

### 1. Authentication & Role-Based Access Control (RBAC) Workflow
- **Frontend**: User enters credentials on Login page.
- **API Call**: `POST /api/auth/login` is triggered.
- **Backend Validation**: `authController` hashes the password and compares it against the DB. If valid, a JWT token is generated including the user's `role` (Admin/Sales/Warehouse/Accounts).
- **State Management**: Frontend saves JWT in `localStorage`. The React `AuthContext` decodes the token, sets the active user, and conditionally renders the Sidebar and routes based on the permissions.

### 2. Customer CRM & Follow-Ups Workflow
- **Creation**: User submits a new customer. `POST /api/customers` creates the profile.
- **Listing**: The frontend fetches all customers via `GET /api/customers` and renders them in a grid.
- **Notes/Follow-up**: When a user clicks a customer, they can add a note. The frontend triggers `POST /api/customers/:id/notes`. 
- **Database**: Prisma inserts a new `CustomerNote` record tied to that specific customer via a Foreign Key, keeping track of the timestamp and the user who created it.

### 3. Sales Challan & Inventory Deduction Workflow
- **Drafting**: A user creates a Challan, selecting a Customer and multiple Products.
- **Snapshotting**: The system snapshots the prices and details. Status starts as `DRAFT`.
- **State Transition**: When status is updated to `CONFIRMED` or `DISPATCHED`, the backend `challanController` intercepts the request.
- **Transaction Engine**: The backend runs a Prisma Transaction that iterates over every product in the challan. It automatically deducts the `stock` from the `Product` table and generates a `StockMovement` log for auditing. If stock drops below 0, the entire transaction rolls back and throws an error to the user.
