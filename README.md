# ⚡Boltgate Documentation

## 🚀 Introduction

**Boltgate** is a CLI tool designed to make setting up **NextAuth** with a Prisma adapter in a Next.js (TypeScript) project effortless.

Manually configuring NextAuth requires installing dependencies, creating config files, and updating your project structure. Boltgate automates all of this by:

1. Installing required **npm** dependencies.
2. Running **npx** scripts for initialization.
3. Copying **template files** (prebuilt configs & boilerplates) into your project.
4. Merging template code into existing files if they already exist.

This saves you from repetitive boilerplate work and ensures you start with a **ready-to-use NextAuth setup** .

---

## 📦 Installation

### 1. Install globally (recommended)

```bash
npm install -g boltgate
```

Now you can run it from anywhere using:

```bash
boltgate
```

### 2. Use via NPX (one-time run)

```bash
npx boltgate
```

---

## ⚡ Usage

Inside your Next.js project folder:

```bash
boltgate
```

What happens when you run this:

1. Boltgate checks your project environment.
2. Installs required **npm dependencies** :
   - `next-auth`
   - `@auth/prisma-adapter`
   - `@prisma/client`
   - `prisma`
   - `react-icons`
3. Runs **npx scripts** (like `prisma init` if included).
4. Copies required template files into your project (auth configs, route handlers, etc).
5. If files already exist, Boltgate **merges** the new template content instead of overwriting.

---

## 📂 Project Structure (after Boltgate setup)

Here’s what Boltgate sets up inside your Next.js app:

```
your-project/
│
├── app/
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts   <-- API route handler for NextAuth
│
├── auth/
│   ├── auth.config.ts         <-- Central NextAuth config
│   ├── callbacks.ts           <-- Example custom callbacks
│   ├── options.ts             <-- Auth options for providers, pages, etc
│   └── types.ts               <-- Type definitions for auth
│
├── lib/
│   └── prisma.ts              <-- Prisma client helper
│
├── prisma/
│   └── schema.prisma          <-- Prisma schema file (updated for auth)
│
└── package.json
```

---

## 🛠 How Boltgate Works Internally

Boltgate has two main parts:

### 1. **bin/index.js** (The CLI entry point)

- This is the script that runs when you type `boltgate` in your terminal.
- Responsibilities:
  1. Show log messages (`📦 Installing dependencies`, `📁 Copying files` etc).
  2. Install npm dependencies (using an array of required packages).
  3. Run necessary npx scripts (like `prisma generate`).
  4. Copy template files from `template/` into the user’s project.
  5. If the file already exists → **append/merge** template code instead of overwriting.

> Think of it as the **“brains”** of the tool.

---

### 2. **template/** (The boilerplate files)

This folder contains the **prebuilt files** that get copied into the Next.js project.

- **`template/auth/`**
  - `auth.config.ts` → Main NextAuth config export.
  - `callbacks.ts` → Example custom JWT/session callbacks.
  - `options.ts` → Options for NextAuth providers, pages, etc.
  - `types.ts` → TypeScript types for auth context.
- **`template/app/api/auth/[...nextauth]/route.ts`**
  - Defines the API route for NextAuth in the Next.js App Router.
  - Exports `GET` and `POST` handlers by using the config.
- **`template/lib/prisma.ts`**
  - Creates and exports a **Prisma Client instance** .
  - Handles hot-reload safe initialization for Next.js (avoiding multiple instances).
- **`template/prisma/schema.prisma`**
  - Prisma schema updated with models required for authentication.
  - Example: `User`, `Account`, `Session`, `VerificationToken`.

---

## 📦 Dependencies

Boltgate installs and configures the following dependencies automatically:

| Package                  | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| **next-auth**            | Core NextAuth library for authentication           |
| **@auth/prisma-adapter** | Adapter for NextAuth to work with Prisma           |
| **@prisma/client**       | Prisma client for database queries                 |
| **prisma**               | CLI for Prisma (schema management & migrations)    |
| **react-icons**          | Icons for UI (optional, but included for auth UIs) |

---

## 📖 Example Workflow

1. Start with a clean Next.js TS project:
   ```bash
   npx create-next-app@latest my-app --typescript
   cd my-app
   ```
2. Run Boltgate:
   ```bash
   npx boltgate
   ```
3. Boltgate does the following automatically:
   - Installs `next-auth`, Prisma, and related deps.
   - Runs `npx prisma init` (creates `prisma/` folder).
   - Copies auth boilerplate files into `auth/`, `lib/`, `app/api/auth/`.
   - Updates your `schema.prisma` with auth models.
4. You now have a **working NextAuth + Prisma setup** . Just add your DB connection string in `.env`, run migrations, and you’re good to go.

---

## 🔑 Development (for contributors)

If you want to test Boltgate locally before publishing:

```bash
git clone https://github.com/JayShende/boltgate.git
cd boltgate
npm install
npm link
```

Now inside any Next.js project, run:

```bash
boltgate
```

It will execute your local development version of Boltgate.

---

## 📤 Publishing

Boltgate is available on npm:

👉 [https://www.npmjs.com/package/boltgate](https://www.npmjs.com/package/boltgate)

To publish updates:

```bash
npm version patch   # or minor/major
npm publish --access public
```

---
