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

<img width="1891" height="827" alt="login" src="https://github.com/user-attachments/assets/259d1f77-5d2c-443f-8ad5-1f65cdfc2b0d" />

<img width="1892" height="977" alt="HOMEpage" src="https://github.com/user-attachments/assets/9b9ad130-067a-460c-8b8c-69113b5e8747" />

<img width="1896" height="970" alt="usr_list3" src="https://github.com/user-attachments/assets/b668affe-7096-4017-880e-ddff7512d263" />

<img width="1857" height="853" alt="user_profile8" src="https://github.com/user-attachments/assets/cbf93f19-8973-4f14-9a25-28c648308e71" />

<img width="1906" height="956" alt="admin_dashboard" src="https://github.com/user-attachments/assets/81ada561-93c9-4a6a-8542-65a999e5f56a" />

<img width="1892" height="968" alt="all_blogs" src="https://github.com/user-attachments/assets/eb7dd348-240e-4408-b74a-e75367ffbf10" />

<img width="1892" height="975" alt="viw_blog" src="https://github.com/user-attachments/assets/cb818936-c924-474c-9f09-cab59e606d7d" />

<img width="1881" height="887" alt="update_blog" src="https://github.com/user-attachments/assets/fbd97e44-c707-473e-a40b-d8aa89a786be" />

<img width="1877" height="977" alt="responsive_tab" src="https://github.com/user-attachments/assets/a9a70e64-6c6a-4ca5-b037-9afaed1d5732" />

<img width="1902" height="963" alt="responsive_mobile" src="https://github.com/user-attachments/assets/8a0e5f78-7c26-4eee-a023-eaae7ccc8e41" />



