# 🧠 Backend API with TypeScript | Modular Structure

This is a scalable and production-ready **Node.js + TypeScript** backend API project following a **modular folder structure** with integrated tools like **ESLint**, **Prettier**, and custom error handling.

---

## 📁 Project Structure

```
src/
│
├── app/                         # App-level configs & helpers
│   └── query/
│       └── qb.ts
│
├── config/                      # Environment & global config files
│   ├── db.ts
│   └── env.ts
│
├── middlewares/                 # Express middlewares (global)
│   ├── errorHandler.ts
│   ├── notFoundHandler.ts
│   └── validateRequest.ts
│
├── errors/
│   ├── handlers/
│   │   ├── duplicateKeyErrorHandler.ts
│   │   ├── jwtErrorHandler.ts
│   │   ├── mongooseCastErrorHandler.ts
│   │   ├── mongooseValidationErrorHandler.ts
│   │   ├── syntaxErrorHandler.ts
│   │   └── zodErrorHandler.ts
│   └── apiErrors.ts
│
├── modules/                    # Feature-based modular system
│   └── user/                   # User domain/module
│       ├── user.controller.ts
│       ├── user.interface.ts
│       ├── user.model.ts
│       ├── user.router.ts
│       ├── user.schema.ts
│       └── user.service.ts
│
├── routes/                     # App-wide route registry
│   └── index.ts
│
├── scripts/                    # Seeders & one-time scripts
│   ├── seedSuperAdmin.ts
│   └── superAdminCreateDetail.ts
│
├── services/                   # Custom reusable service layer
│   └── existCheckService.ts
│
├── utils/                      # Utilities & helpers
│   ├── apiError.ts
│   ├── catchAsync.ts
│   ├── hash.ts
│   └── response.ts
│
├── app.ts                      # App initialization
├── index.ts                    # Server entry point
│
├── .env                        # Environment variables
├── .eslint.config.mjs          # ESLint config
├── .prettierignore             # Prettier ignore config
├── .prettierrc                 # Prettier config
├── package.json                # Package manifest
├── README.md                   # Project README
└── tsconfig.json               # TypeScript config

```

---

## 🧰 Tech Stack

- **Node.js**
- **TypeScript**
- **ESLint** (with `typescript-eslint` & Prettier)
- **Prettier** (code formatter)
- **Modular Folder Structure**
- **Custom Error Handling**
- **dotenv** for environment configs

## 🚀 Getting Started

### ✅ Installation Guide

Clone the repository using **SSH** or **HTTPS**, then install the dependencies:

---

#### 🔗 Clone using SSH

```bash
git clone git@github.com:Anirbandasjoy/APIForge.git
```

```bash
cd APIForge
```

```bash
yarn
```

#### 🌐 Or, clone using HTTPS

```bash
git clone https://github.com/Anirbandasjoy/APIForge.git
```

```bash
cd APIForge
```

```bash
yarn
```

✨ You're now ready to start developing!

## 📜 Scripts

```json
"scripts": {
    "dev": "ts-node-dev -r tsconfig-paths/register src/index.ts",
    "build": "tsc && tsc-alias",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "fix-all": "eslint . --ext .js,.ts,.tsx --fix && prettier --write .",
    "seed:superadmin": "ts-node -r tsconfig-paths/register src/scripts/seedSuperAdmin.ts",
    "clear": "rm -rf dist node_modules yarn.lock"
  },
```

---

## 📜 Scripts & Usage Guide

| Script                 | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `yarn dev`             | Start development server using `ts-node-dev` with path alias support.       |
| `yarn build`           | Build the project using `tsc` and apply alias mappings with `tsc-alias`.    |
| `yarn start`           | Run the compiled JavaScript from the `dist/` folder (used in production).   |
| `yarn lint`            | Check for ESLint issues in `.ts` files.                                     |
| `yarn lint:fix`        | Automatically fix lint issues.                                              |
| `yarn format`          | Format all files using Prettier.                                            |
| `yarn fix-all`         | Fix all ESLint and Prettier issues in one command.                          |
| `yarn seed:superadmin` | Run the script to seed the default super admin user.                        |
| `yarn clear`           | Clean up the project by deleting `dist/`, `node_modules/`, and `yarn.lock`. |

---

### 🧪 Common Commands

```bash
yarn dev            # Start the development server
yarn build          # Build the project
yarn start          # Start the production server

yarn lint           # Check for lint issues
yarn lint:fix       # Auto fix lint issues
yarn format         # Format code using Prettier
yarn fix-all        # Fix both ESLint and Prettier issues

yarn seed:superadmin  # Seed a default super admin user
yarn clear            # Remove dist, node_modules, and yarn.lock
```

---

## 📦 Environment Variables

Create a `.env` file in the root and configure like:

```
PORT
MONGO_URI
JWT_SECRET
NODE_ENV
CLIENT_URI

SUPER_ADMIN_NAME
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
NODE_ENV



SMTP_USERNAME
SMTP_PASSWORD



JWT_ACCESS_SECRET_KEY
JWT_ACCESS_EXPIRES_IN




JWT_REFRESH_SECRET_KEY
JWT_REFRESH_EXPIRES_IN



JWT_PROCESS_REGISTRATION_SECRET_KEY
JWT_PROCESS_REGISTRATION_EXPIRES_IN



JWT_PASSWORD_FORGOT_PASSWORD_SECRET
JWT_PASSWORD_FORGOT_PASSWORD_EXPIRES_IN
```

---

## 🧪 Seeder Example

To create a default super admin:

```bash
yarn seed:superadmin
```

---

## 🧹 Linting Configuration

- No `var` allowed (must use `let` or `const`)
- ESLint integrated with Prettier
- Auto format on save supported

---

## 📞 Contact & Author Info

**Anirban Das joy**  
_Backend Developer | MERN Stack Enthusiast_  
Moulvibazar Polytechnic Institute, Department of CSE

- 📧 Email: [joy600508@gmail.com](mailto:joy600508@gmail.com)
- 💻 GitHub: [github.com/Anirbandasjoy](https://github.com/Anirbandasjoy)
- 🔗 LinkedIn: [linkedin.com/in/anirbandasjoy404](https://www.linkedin.com/in/anirbandasjoy404)
- 📘 Facebook: [facebook.com/anirbandasjoy](https://web.facebook.com/Anirbandasjoy)

Feel free to reach out for collaboration, questions, or freelance projects!
