# Mini ERP + CRM Operations Portal — Fundsroom

A full-stack Mini ERP and CRM system for a wholesale/distribution company, built with Node.js, Express, PostgreSQL (Supabase), Prisma, React, and Vite.

## Features
- **Role-based Authentication (RBAC):** Login with 4 roles — Admin, Sales, Warehouse, Accounts. Each role only sees the features they are authorized to access.
- **Customer CRM:** Manage customers (Retail, Wholesale, Distributor) and add follow-up notes.
- **Product & Inventory:** Manage products, track stock levels, and view stock movement logs.
- **Sales Challans:** Create Draft challans, and Confirm them to automatically deduct stock. Prevents negative stock via database transactions.
- **Purchase Orders:** Warehouse can create purchase orders to track inbound stock from suppliers.
- **Invoices:** Accounts team can generate invoices linked to customers or challans, and track payment status.
- **Live Dashboard:** Real-time metrics showing Total Customers, Low Stock Products, Draft & Confirmed Challans.

## RBAC — Role Access Matrix

| Feature | Admin | Sales | Warehouse | Accounts |
|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Customers (CRM) | ✅ | ✅ | ❌ | ❌ |
| Products & Inventory | ✅ | ✅ | ✅ | ❌ |
| Purchase Orders | ✅ | ❌ | ✅ | ❌ |
| Sales Challans | ✅ | ✅ | ✅ | ❌ |
| Invoices | ✅ | ❌ | ❌ | ✅ |

## Tech Stack
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL (Supabase), JWT, bcryptjs.
- **Frontend:** React, Vite, TypeScript, Axios, Lucide Icons, Vanilla CSS.
- **Database:** Supabase (Managed PostgreSQL — free tier).

---

## ⚠️ Important: Supabase Free-Tier Notice

> Supabase free-tier projects **auto-pause after 7 days of inactivity**. If the login shows a database connection error, please follow these steps:
>
> 1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
> 2. Log in and open the project
> 3. Click the **"Restore"** button to resume the project
> 4. Wait ~2 minutes for the database to become active
> 5. Try logging in again — it will work immediately

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)

### 1. Backend Setup
```bash
cd backend
npm install

# Generate the Prisma Client
npx prisma generate

# Push schema to database (if running fresh)
npx prisma db push

# Seed the database with demo users
npm run seed

# Start the development server
npm run dev
```
The backend will start on **http://localhost:5000**.

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
The frontend will start on **http://localhost:5173**.

### Demo Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@minierp.com | admin123 |
| Sales | sales@minierp.com | sales123 |
| Warehouse | warehouse@minierp.com | warehouse123 |
| Accounts | accounts@minierp.com | accounts123 |

---

## API Documentation

The backend exposes RESTful APIs at `http://localhost:5000`. All routes under `/api/*` (except login) require a `Bearer <token>` header.

### Auth
- `POST /api/auth/login` - Authenticate user and receive JWT.

### Dashboard
- `GET /api/dashboard` - Get live dashboard statistics.

### Customers
- `GET /api/customers` - List all customers.
- `GET /api/customers/:id` - Get customer details with notes.
- `POST /api/customers` - Create a new customer.
- `PUT /api/customers/:id` - Update a customer.
- `POST /api/customers/:id/notes` - Add a follow-up note.

### Products
- `GET /api/products` - List all products.
- `GET /api/products/:id` - Get product details and stock movement logs.
- `POST /api/products` - Create a new product.
- `PUT /api/products/:id` - Update a product.
- `POST /api/products/:id/stock` - Manually adjust stock (IN/OUT).

### Sales Challans
- `GET /api/challans` - List all challans.
- `GET /api/challans/:id` - Get challan details with items.
- `POST /api/challans` - Create a new Draft challan.
- `POST /api/challans/:id/confirm` - Confirm challan and deduct stock (transaction-protected).

### Purchase Orders
- `GET /api/pos` - List all purchase orders.
- `POST /api/pos` - Create a new purchase order.
- `POST /api/pos/:id/receive` - Receive a PO and add stock (transaction-protected).

### Invoices
- `GET /api/invoices` - List all invoices.
- `POST /api/invoices` - Create a new invoice.
- `PUT /api/invoices/:id/status` - Update invoice payment status.

---

## Deployment Strategy

### Database (Supabase — Free Tier)
Already configured. Connection strings are in the `.env` file.

### Backend (Render / Railway)
1. Push this repository to GitHub.
2. Connect Render/Railway to the repository.
3. Set Root Directory: `backend`
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npm start`
6. Add Environment Variables: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `PORT`

### Frontend (Vercel / Netlify)
1. Connect Vercel to the GitHub repository.
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add: `VITE_API_URL` pointing to the deployed backend URL.

---

## Architecture & Design Decisions

- **Architecture:** Monolithic client-server. Express API serves JSON, React SPA consumes it. Prisma ORM ensures type safety between database schema and TypeScript models.
- **Single Portal with RBAC:** One unified login page. The system dynamically shows/hides sidebar menus and protects API routes based on the user's role.
- **Stock Protection:** Challan confirmation uses a Prisma `$transaction` to atomically check stock levels and deduct quantities, preventing negative stock even under concurrent requests.
- **Supabase Integration:** Uses Supabase's managed PostgreSQL with connection pooling (PgBouncer on port 6543) for optimal performance.
