<div align="center">
  <br/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <br/><br/>

  <h1>🚀 PrimeTrade API</h1>
  <p><strong>Scalable REST API with Authentication & Role-Based Access</strong></p>
  <p>A production-grade full-stack application built with Node.js, Express, MongoDB, Next.js, TypeScript, and Tailwind CSS.</p>

  <br/>

  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-endpoints">API Endpoints</a> •
  <a href="#-frontend">Frontend</a> •
  <a href="#-security">Security</a>

  <br/><br/>
</div>

---

## ✨ Features

### Backend
| Feature | Description |
|---|---|
| **JWT Authentication** | Secure login/register with access + refresh tokens |
| **Role-Based Access** | `user` and `admin` roles with fine-grained permissions |
| **CRUD Operations** | Full Create, Read, Update, Delete for products |
| **API Versioning** | All endpoints prefixed with `/api/v1/` |
| **Input Validation** | Request body validation using `express-validator` |
| **Error Handling** | Centralized error handler with custom `AppError` class |
| **Rate Limiting** | 10 req/min on auth routes, 100 req/min globally |
| **Security Headers** | Helmet.js for HTTP security headers |
| **Request Logging** | Morgan for HTTP request logging |
| **Swagger Docs** | Interactive API documentation at `/api-docs` |
| **Refresh Tokens** | Long-lived refresh tokens stored in DB |
| **Pagination** | Paginated product listing with page/limit params |
| **Search & Filter** | Filter products by category, search by name |
| **Graceful Shutdown** | SIGTERM/SIGINT handlers for clean shutdown |
| **Seed Script** | Pre-configured script to create admin + test users |

### Frontend
| Feature | Description |
|---|---|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Full type safety with strict mode |
| **Tailwind CSS v4** | Utility-first styling with custom animations |
| **Auth Context** | React Context API for global auth state |
| **Toast Notifications** | Context-based toast system with auto-dismiss |
| **Loading States** | Spinners, skeletons, and pulse animations |
| **Inline Editing** | Edit products directly in the table (admin) |
| **Responsive Design** | Mobile-friendly grid layout |
| **Environment Config** | API URL via `NEXT_PUBLIC_API_URL` |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing (12 rounds) |
| **helmet** | Security headers |
| **express-rate-limit** | Rate limiting |
| **morgan** | HTTP request logging |
| **express-validator** | Input validation |
| **swagger-jsdoc / swagger-ui-express** | API documentation |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **React Context API** | State management |

---

## 🏗 Architecture

### Backend Layered Architecture

```
server/
├── src/
│   ├── config/          # Database & environment config
│   ├── controllers/     # HTTP request handlers
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Helpers (AppError, apiResponse)
│   ├── validators/      # Request validation rules
│   ├── index.js         # Entry point
│   └── swagger.js       # Swagger configuration
├── .env                 # Environment variables
├── seed.js              # Database seed script
└── package.json
```

The backend follows a **Controller → Service → Model** pattern:
- **Routes** define endpoints and attach middleware
- **Controllers** handle HTTP request/response
- **Services** contain business logic
- **Models** define database schemas

### Frontend Component Architecture

```
client/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── layout.tsx   # Root layout with AuthProvider
│   │   ├── page.tsx     # Auth page (login/register)
│   │   └── products/
│   │       └── page.tsx # Products page
│   ├── components/      # Reusable UI components
│   │   ├── AuthForms.tsx
│   │   ├── CreateProductForm.tsx
│   │   ├── ProductTable.tsx
│   │   └── Toast.tsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.tsx
│   ├── lib/             # Utilities & API client
│   │   └── api.ts
│   └── types/           # TypeScript type definitions
│       └── index.ts
├── .env.local           # Environment variables
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** v6+ (running on `localhost:27017`)
- **npm** v9+

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/ali-imtiyazkhan/Primetrade_assignment.git
cd Primetrade_assignment

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Backend - copy and edit
cd server
cp .env.example .env
# Edit .env with your settings

# Frontend - already configured
# Edit client/.env.local if needed
```

### 3. Seed the Database (Optional)

```bash
cd server
npm run seed
```

This creates two test users:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@primetrade.com | admin123 |
| **User** | user@primetrade.com | user123 |

### 4. Run the Application

```bash
# Terminal 1 - Start the backend (port 5000)
cd server
npm start

# Terminal 2 - Start the frontend (port 3000)
cd client
npm run dev
```

### 5. Access

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **API** | http://localhost:5000 |
| **Swagger Docs** | http://localhost:5000/api-docs |
| **Health Check** | http://localhost:5000/health |

---

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login with email & password |
| `POST` | `/refresh` | ❌ | Refresh access token |
| `POST` | `/logout` | ✅ | Logout (invalidate refresh token) |
| `GET` | `/me` | ✅ | Get current user profile |

### Products (`/api/v1/products`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | ✅ | All | List products (paginated) |
| `GET` | `/:id` | ✅ | All | Get single product |
| `POST` | `/` | ✅ | Admin | Create a product |
| `PUT` | `/:id` | ✅ | Admin | Update a product |
| `DELETE` | `/:id` | ✅ | Admin | Delete a product |

### Query Parameters (GET `/products`)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page (max 100) |
| `category` | string | — | Filter by category |
| `search` | string | — | Search by product name |

### Response Format

All API responses follow a consistent structure:

```json
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔒 Security

### Authentication Flow

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│  Client │ ──POST──▶  Server  │ ──Save──▶  MongoDB  │
│         │◀──JWT────          │         │          │
└─────────┘         └──────────┘         └──────────┘
     │                                      │
     │ ──Request + Bearer Token──▶           │
     │◀──Protected Resource───              │
```

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Short-lived access tokens (15 min) + long-lived refresh tokens (7 days)
- **Rate Limiting**: 10 attempts per 15 minutes on auth endpoints
- **Security Headers**: Helmet.js for XSS, clickjacking, MIME sniffing protection
- **Input Validation**: All request bodies validated and sanitized
- **CORS**: Configurable origin whitelist

---

## 📸 Screenshots

<details>
<summary>Click to expand</summary>

### Auth Page
![Auth Page](https://via.placeholder.com/800x400?text=Auth+Page+Screenshot)

### Products Page
![Products Page](https://via.placeholder.com/800x400?text=Products+Page+Screenshot)

### Swagger Documentation
![Swagger](https://via.placeholder.com/800x400?text=Swagger+Documentation+Screenshot)

</details>

---

## 📝 License

This project is submitted as part of a **Backend Developer Intern** assignment.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/ali-imtiyazkhan">Ali Imtiyaz Khan</a></sub>
</div>
