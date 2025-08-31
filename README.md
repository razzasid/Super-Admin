# Super Admin Backend + Client

This project implements a **Super Admin system** with backend APIs (Node.js, Express, MongoDB) and a minimal React client for testing flows.

The Super Admin can:

- Manage **Users** (CRUD, assign roles).
- Manage **Roles & Permissions**.
- View **Audit Logs** (for user/role changes).
- View **Basic Analytics** (user/role counts, login activity).
- Login securely with JWT (superadmin only).

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT
- **Frontend**: React (Vite)
- **Testing**: Jest + Supertest
- **Other**: ESLint, Nodemon

---

## 📂 Repository Structure

```
super-admin/
├── src/              # Backend source code
│   ├── controllers/  # API controllers
│   ├── middleware/   # Auth, validation, audit logging
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── utils/        # DB + helpers
│   ├── config/       # Config/env loader
│   └── app.js        # Express entry point
├── client/           # React frontend (minimal UI)
├── scripts/
│   └── seed.js       # Seeds superadmin user
├── tests/            # Jest + Supertest tests
├── .env.example      # Example env file
├── package.json      # Backend scripts/deps
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/razzasid/Super-Admin.git
cd Super-Admin
```

### 2. Install dependencies

#### Backend

```bash
npm install
```

#### Frontend

```bash
cd client
npm install
cp .env.example .env
cd ..
```

### 3. Configure environment

Copy `.env.example` to `.env` in project root:

```bash
cp .env.example .env
```

Default values:

```
# Server
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/superadmin

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Seeding
ADMIN_EMAIL=superadmin@example.com
ADMIN_PASSWORD=Test1234!
```

> Note: Project currently uses **local MongoDB**. Please ensure MongoDB is running locally on port 27017.  
> To start Mongo quickly with Docker:
>
> ```bash
> docker run -d --name mongo -p 27017:27017 mongo:5
> ```

---

## 🌱 Seeding Superadmin

Run seed script to create initial superadmin:

```bash
npm run seed
```

This will create:

- **Email**: `superadmin@example.com`
- **Password**: `Test1234!`

Use these credentials to login.

---

## ▶️ Running the Project

### Start backend

```bash
npm run dev   # dev with nodemon
# OR
npm start     # normal start
```

Backend runs at: `http://localhost:3000`

### Start frontend

```bash
cd client
npm start
```

Frontend runs at: `http://localhost:5173` (Vite default) or `http://localhost:3001` (CRA default).

---

## 🧪 Testing

Run Jest + Supertest test suite:

```bash
npm test
```

---

## 📬 API Docs & Postman

- A Postman collection is provided in `/docs/postman_collection.json`.
- Import it into Postman to test all endpoints.
- Example APIs:
  - `POST /api/v1/auth/login`
  - `GET /api/v1/superadmin/users`
  - `POST /api/v1/superadmin/users`

---

## 🖥️ Features (UI)

Frontend client provides:

- **Login page** (JWT auth).
- **Users list** with search, pagination, View/Edit/Delete.
- **Assign role modal**.
- **User details modal**.
- **Audit log viewer** with filters.
- **Analytics dashboard** with summary cards.
