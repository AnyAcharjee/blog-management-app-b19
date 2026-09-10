# Blog Management App

## Project Overview

A full-stack blog management application with a Node.js/Express REST API backend (MySQL via Sequelize) and a Next.js frontend. Users can register, log in, and manage their own blog posts, while admins can manage all users and blogs from a dedicated admin area.

## Main Features

- **Authentication** — registration, login (JWT), forgot-password / reset-password via token.
- **Blog CRUD** — create, read, update, delete blog posts; public listing with search by title and filter by category.
- **User profile** — view/update profile (name), change password, upload a profile avatar.
- **Admin user management** — list all users, view a user's details, activate/deactivate accounts.
- **Ownership & role-based access** — users can only edit/delete their own blogs; admins can manage any blog or user.
- **Account activation gating** — deactivated accounts are blocked from logging in or making authenticated requests.

## Technologies

**Backend**
- Node.js (ESM) + Express 5
- Sequelize ORM with MySQL (`mysql2`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- File uploads (`multer`)
- `cors`, `dotenv`

**Frontend**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4

## Installation

```bash
git clone <repo-url>
cd blog-management-app-b19

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Variables

Copy [.env.example](.env.example) into `backend/.env` and `frontend/.env.local` respectively.

**backend/.env**

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_NAME` | MySQL database name |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `PORT` | Backend server port (defaults to `5001` if unset) |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `7d`) |
| `FRONTEND_URL` | Frontend base URL, used to build password-reset links |

**frontend/.env.local**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

## How to Run the Application

Create the MySQL database referenced by `DB_NAME` first, then:

```bash
# Backend (from backend/)
npm run dev     # start with nodemon (auto-restart)
npm start       # start with node

# Seed a default admin account (admin@example.com / password123)
npm run seed:admin
```

```bash
# Frontend (from frontend/)
npm run dev     # start Next.js dev server
npm run build   # production build
npm start       # start production server
```

The backend syncs its schema automatically on startup (`sequelize.sync({ alter: true })`) — no separate migrations are required.

## Backend Dependencies

```json
"dependencies": {
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "multer": "^2.3.0",
  "mysql2": "^3.24.2",
  "sequelize": "^6.37.8"
},
"devDependencies": {
  "nodemon": "^3.1.14"
}
```

## Application Routes

All API routes are mounted under `/api`. Uploaded files (e.g. avatars) are served statically from `/uploads`.

**Auth** (`/api/auth`)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in, returns JWT + user |
| POST | `/api/auth/forgot-password` | Request a password reset link |
| PATCH | `/api/auth/reset-password/:token` | Reset password using a reset token |

**Users** (`/api/users`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/users/profile` | user | Get own profile |
| PUT | `/api/users/profile/update` | user | Update own name |
| PATCH | `/api/users/password` | user | Change own password |
| PATCH | `/api/users/profile/image` | user | Upload/replace own avatar |
| GET | `/api/users` | admin | List all users |
| GET | `/api/users/:id` | admin | Get a user by id |
| PATCH | `/api/users/:id/status` | admin | Activate/deactivate a user |

**Blogs** (`/api/blogs`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/blogs` | public | List blogs (`?title=`, `?category=`) |
| GET | `/api/blogs/:id` | public | Get a single blog |
| POST | `/api/blogs/create` | user | Create a blog |
| PUT | `/api/blogs/update/:id` | owner/admin | Update a blog |
| DELETE | `/api/blogs/:id` | owner/admin | Delete a blog |

## User/Admin Functionality

**Authenticated user**
- Manage own profile: view, update name, change password, upload avatar.
- Create blogs, and update/delete only blogs they own.

**Admin** (in addition to regular user abilities)
- List all users and view any user's details.
- Activate/deactivate any user account.
- Update or delete any blog, regardless of ownership.

Role is fixed to `user` at registration and cannot be self-escalated via the API — admin accounts are created via the `seed:admin` script or set directly in the database. On the frontend, `/admin` routes are gated by `AuthContext`/role checks, with the backend `authorizeAdmin` middleware as the actual enforcement point.
