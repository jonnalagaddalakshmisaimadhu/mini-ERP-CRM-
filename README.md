# Mini ERP + CRM Operations Portal

A complete full-stack web application designed for wholesale and distribution companies. This portal handles Customer CRM, Product & Inventory Management, Sales Challans, and robust Authentication with role-based access control.

This project was developed for a Full-Stack Developer Case Study. It strictly adheres to all specified guidelines, demonstrating architecture, clean APIs, a responsive frontend, and deployment strategies.

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
A complete **Postman Collection** is provided in the repository (`mini_erp_postman_collection.json`). You can import this directly into Postman to review and test all backend endpoints (Auth, Customers, Products, Challans).

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
