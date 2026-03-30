# 🛒 E-commerce Backend (Node.js + TypeScript)

## 📌 Overview

This project is a scalable e-commerce backend system built with:

- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Redis (caching & queue)
- Elasticsearch (search)

It supports:

- Authentication & Authorization (JWT)
- Role-based access (Admin / Seller / Customer)
- Seller onboarding system
- Product (SPU / SKU)
- Inventory management

---

## 🏗️ Architecture

```
src/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── models/
 ├── routes/
 ├── middlewares/
 ├── utils/
 └── app.ts
```

---

## 🔐 Authentication & Authorization

### Features

- JWT Access Token
- Refresh Token
- Role-based authorization

### Roles

- ADMIN
- SELLER
- CUSTOMER

---

## 🧑‍💼 Seller Application Flow

1. Customer applies to become seller
2. Application stored in `seller_applications`
3. Admin reviews
4. Approve → user becomes SELLER
5. Reject → stays CUSTOMER

---

## 📦 Product System

### Structure

```
Category → Product (SPU) → SKU → Inventory
```

### SPU

- General product info

### SKU

- Variants (color, size, etc.)

### Inventory

- quantity
- reserved

Available stock = quantity - reserved

---

## 📡 API Endpoints

### Auth

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Seller

```
POST /api/seller/apply
GET /api/seller/my-application
GET /api/seller/admin/applications
PATCH /api/seller/admin/applications/:id/approve
PATCH /api/seller/admin/applications/:id/reject
```

### Product

```
POST /api/seller/products
POST /api/seller/products/:id/skus
PATCH /api/seller/skus/:id
```

---

## ⚙️ Environment Variables

Create `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
```

---

## 🚀 Getting Started

### Install

```
npm install
```

### Run Dev

```
npm run dev
```

### Build

```
npm run build
```

---

## 📈 Future Improvements

- Payment integration (Stripe, VNPay)
- Order system
- Cart service (Redis)
- Elasticsearch product search
- Notification system

---

## 👨‍💻 Author

Huynh Nhat Hao

---

## 📄 License

MIT
