# ExpressJS TypeScript Starter Template

## 📋 Description

A modern, production-ready boilerplate for building RESTful APIs with Express.js and TypeScript.

## 🚀 Technologies

- **Express.js**: Web application framework for Node.js
- **TypeScript**: Strongly typed programming language
- **Prisma**: Next-generation ORM
- **JWT**: JSON Web Tokens for authentication
- **Zod**: TypeScript-first schema validation
- **Winston**: Logging library
- **ESLint & Prettier**: Code quality and formatting
- **Husky & lint-staged**: Git hooks for code quality

## ⚙️ Prerequisites

- Node.js (v22 recommended)
- SQLite (included for development) or support database by Prisma

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dvsxdev/express-ts-starter.git
   ```

2. Navigate to the project directory:

   ```bash
   cd express-ts-starter
   ```

3. Create environment variables file:

   ```bash
   cp .env.example .env
   ```

   > **Important:** Configure your `.env` file with appropriate values, especially `JWT_SECRET`

4. Install the dependencies:

   ```bash
   npm install
   ```

   > **Note:** This command also generates the Prisma client and initializes the database automatically.

5. Set up the database with Prisma (optional, only if you need to reset or update the database schema):
   ```bash
   npx prisma migrate dev
   ```

## 🏃‍♂️ Development

To start the application in development mode:

```bash
npm run dev
```

## 🏗️ Build

To build the application for production:

```bash
npm run build
```

## ▶️ Production

To run the application in production mode:

```bash
npm run start
```

## 📊 Database Management

> **Note:** The database is automatically set up during installation when running `npm install`.

### Prisma Setup

To initialize Prisma:

```bash
npx prisma init
```

To generate Prisma client after schema changes:

```bash
npx prisma generate
```

To create and apply migrations:

```bash
npx prisma migrate dev --name your_migration_name
```

To open Prisma Studio (database GUI):

```bash
npx prisma studio
```

## 📂 Project Structure

```
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Middleware functions
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   ├── validations/  # Input validation schemas
│   ├── app.ts        # Express app setup
│   └── server.ts     # Server entry point
├── prisma/
│   └── schema.prisma # Database schema
├── types/            # TypeScript type definitions
└── logs/             # Application logs
```

## 🧹 Code Quality

- Run `npm run lint:check` to check for linting issues
- Run `npm run lint:fix` to automatically fix linting issues
- Run `npm run format:check` to check for formatting issues
- Run `npm run format:fix` to automatically fix formatting issues

## 📝 License

This project is licensed under the MIT License.
