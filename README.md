# Mini ERP + CRM Operations Portal

![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)

A complete full-stack web application designed for wholesale and distribution companies. This portal handles Customer CRM, Product & Inventory Management, Sales Challans, Invoices, Purchase Orders, and robust Authentication with role-based access control.

This project was developed for a Full-Stack Developer Case Study. It strictly adheres to all specified guidelines, demonstrating architecture, clean APIs, a responsive frontend, and deployment strategies.

## 🚀 Live Links
- **Frontend (Live App):** [https://mini-erp-crm-orpin.vercel.app](https://mini-erp-crm-orpin.vercel.app)
- **Backend API Base URL:** [https://mini-erp-crm-ftfk.vercel.app](https://mini-erp-crm-ftfk.vercel.app)

---

## 🏗️ Project Architecture

The application is built using a modern **Monorepo** structure, splitting the Frontend and Backend into separate concerns while keeping them in the same repository for easy version control.

### High-Level Architecture
1. **Client Tier (Frontend):** React (Vite) application hosted on Vercel. Communicates with the backend via RESTful APIs using Axios.
2. **Server Tier (Backend):** Node.js / Express.js server hosted on Vercel (Serverless Functions). Handles business logic, role validation, and routing.
3. **Database Tier:** PostgreSQL database hosted on Supabase. Accessed by the backend using Prisma ORM.

---

## 📂 Project Structure & Files

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

## 🔄 Workflow Design

### 1. Authentication & Role-Based Access Control (RBAC)
- **Workflow:** User logs in -> Backend verifies password & signs JWT -> Frontend saves JWT in `localStorage` -> Frontend Context updates and unlocks routes based on role (`ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`).

### 2. Customer CRM
- **Workflow:** Users can create customer profiles (Retail/Wholesale). Anyone can append timestamped follow-up notes to a customer.

### 3. Sales Challan Flow (Core Business Logic)
- **Workflow:** 
  1. A user creates a Challan, selecting a Customer and multiple Products.
  2. The system snapshots the prices and details. 
  3. Status starts as `DRAFT`.
  4. When status is updated to `CONFIRMED` or `DISPATCHED`, the backend triggers an inventory transaction, automatically deducting stock.
  5. The system prevents stock from going negative using transaction validation.

### 4. Inventory Management
- **Workflow:** Whenever stock is added or removed (manually or via a Challan), a `StockMovement` log is created to provide a full audit trail of inventory changes.

---

## 💻 Setup & Local Execution

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or use the provided hosted Supabase connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/jonnalagaddalakshmisaimadhu/mini-ERP-CRM-.git
cd mini-ERP-CRM-
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
JWT_SECRET=super_secret_jwt_key
DATABASE_URL="postgresql://postgres.wtzylsylntqjymnhqlyi:Madhu63030@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.wtzylsylntqjymnhqlyi:Madhu63030@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```
Run Database Migrations and start the server:
```bash
npx prisma generate
npm run dev
```

### 3. Frontend Setup
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

## 🔑 Test Login Credentials

Use the following credentials to test the various Role-Based Access Controls (RBAC) in the system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@test.com | password123 |
| **Sales** | sales@test.com | password123 |
| **Warehouse** | warehouse@test.com | password123 |
| **Accounts** | accounts@test.com | password123 |

---

## 📡 API Documentation
A complete **Postman Collection** is provided in the repository (`mini_erp_postman_collection.json`). You can import this directly into Postman to review and test all backend endpoints (Auth, Customers, Products, Challans, Invoices, Purchase Orders).
