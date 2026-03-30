# E-Commerce Platform

A full-stack e-commerce workspace with a **Node.js + Express + TypeScript backend** and a **React + Vite frontend**.

It is organized as a monorepo and currently covers the core commerce flow:

- 🔐 Authentication with JWT, refresh token, Google login, OTP verification, and resend OTP
- 👤 User and role-based access control
- 🏪 Vendor onboarding and management
- 🗂️ Category management
- 📦 Product SPU / SKU flow
- 📊 Inventory tracking and stock reservation
- 🛒 Cart management with Redis
- 🎟️ Discount and coupon support
- 📋 Order creation flow
- 💵 COD-only payment flow

---

## 🧱 Project Structure

```text
ecommerce/
├── backend/   # Express + TypeScript API
└── frontend/  # React + Vite client
```

### Backend architecture

```text
src/
├── config/
├── database/
├── helper/
├── middleware/
├── module/
│   ├── auth/
│   ├── user/
│   ├── vendor/
│   ├── category/
│   ├── product/
│   ├── cart/
│   ├── inventory/
│   ├── discount/
│   ├── order/
│   └── payment/
├── types/
└── utils/
```

The backend follows a layered style using **controller → service → repository → model**, with **Inversify** for dependency injection.

---

## ⚙️ Tech Stack

| Layer                  | Stack                                         |
| ---------------------- | --------------------------------------------- |
| Frontend               | React, Vite, TypeScript, React Query, Zustand |
| Backend                | Node.js, Express, TypeScript                  |
| Database               | MongoDB + Mongoose                            |
| Cache / Queue          | Redis, BullMQ                                 |
| Auth                   | JWT, Google OAuth, OTP                        |
| Media                  | Cloudinary                                    |
| Search / Observability | Elasticsearch, Winston                        |

---

## 🚀 Quick Start

### 1) Prerequisites

Make sure you have installed:

- `Node.js` 18+
- `npm`
- `MongoDB`
- `Redis`

### 2) Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3) Configure environment

Create `backend/.env` and provide values for the variables used by the app:

```env
PORT=3000
BUILD_MODE=dev
API_PREFIX=/api
DOMAIN=localhost:3000
CLIENT_DOMAIN=localhost:5173

MONGO_URI=your_mongodb_uri
REDIS_URI=your_redis_uri
CORS_ALLOWED_ORIGINS=http://localhost:5173

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

MAIL_HOST=your_mail_host
MAIL_PORT=your_mail_port
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password
MAIL_FROM=your_sender_email

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri

ES_NODE=your_elasticsearch_node
ES_USERNAME=your_es_username
ES_PWD=your_es_password
```

### 4) Run the project

#### Start backend

```bash
cd backend
npm run dev
```

#### Start frontend

```bash
cd frontend
npm run dev
```

---

## 📜 Useful Scripts

### Backend

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run prettier:fix
npm run generate:permissions
npm run generate:roles
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
npm run prettier:fix
```

---

## 🌐 Main API Modules

The backend currently exposes flows around these route groups:

- `auth` → sign up, sign in, refresh token, logout, verify OTP, resend OTP
- `users` → profile and account actions
- `vendors` → vendor onboarding and approval flow
- `categories` → category CRUD
- `products` → SPU / SKU management
- `cart` → add, update, remove, clear cart
- `inventory` → stock, reserve, release, commit
- `discounts` → create, apply, disable, query available discounts
- `orders` → place and manage orders
- `payments` → COD payment tracking

Health check:

```http
GET /check-status
```

---

## 🛒 Commerce Flow Overview

```text
Category -> Product (SPU) -> SKU -> Inventory -> Cart -> Order -> Payment (COD)
```

---

## 📌 Current Notes

- Payment flow is currently **COD only**.
- Redis is used for transient features such as **cart**, **OTP**, and **session/token management**.
- The codebase is structured for future expansion into more advanced payment and search flows.

---

## 📄 License

This project is currently for learning / internal development use.
