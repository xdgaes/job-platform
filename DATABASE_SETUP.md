# Database & Prisma Setup Guide

This guide will help you initialize PostgreSQL and Prisma for your Clipper & Creator platform.

---

## 📋 Prerequisites

Make sure you have these installed:
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

---

## 🗄️ Step 1: Install PostgreSQL

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### On Windows:
Download and install from: https://www.postgresql.org/download/windows/

---

## 🔐 Step 2: Create PostgreSQL Database

### Option A: Using psql (Recommended)

1. **Access PostgreSQL:**
```bash
sudo -u postgres psql
```

2. **Create a database:**
```sql
CREATE DATABASE clippa_db;
```

3. **Create a user (optional but recommended):**
```sql
CREATE USER clippa_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE clippa_db TO clippa_user;
```

4. **Exit psql:**
```sql
\q
```

### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name it `clippa_db`
5. Click "Save"

---

## ⚙️ Step 3: Configure Environment Variables

1. **Navigate to backend directory:**
```bash
cd /workspace/backend
```

2. **Edit the `.env` file:**
The file has been created for you at `/workspace/backend/.env`

3. **Update DATABASE_URL with your credentials:**
```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Examples:**

- **Local PostgreSQL (default):**
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clippa_db?schema=public"
  ```

- **Custom user:**
  ```env
  DATABASE_URL="postgresql://clippa_user:your_secure_password@localhost:5432/clippa_db?schema=public"
  ```

- **Remote PostgreSQL (e.g., Railway, Supabase):**
  ```env
  DATABASE_URL="postgresql://user:password@host.railway.app:5432/railway?schema=public"
  ```

4. **Update JWT_SECRET** (important for security):
```env
JWT_SECRET="your-random-secret-key-here"
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 Step 4: Install Dependencies

```bash
cd /workspace/backend
npm install
```

This installs:
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI (dev dependency)
- All other backend dependencies

---

## 🔨 Step 5: Initialize Prisma (if needed)

**Note:** Your Prisma is already set up, but if you need to reinitialize:

```bash
cd /workspace/backend
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema (already exists)
- `.env` file - Environment variables (already created)

---

## 🚀 Step 6: Apply Database Migrations

### Option A: Create and Apply Migration (Recommended)

This creates the migration and applies it to your database:

```bash
cd /workspace/backend
npx prisma migrate dev --name init
```

This will:
1. Create all tables (User, Job, Application, Wallet, Transaction)
2. Apply the dual-role system changes
3. Generate Prisma Client

### Option B: Push Schema Without Migration

Quick way for development (doesn't create migration files):

```bash
cd /workspace/backend
npx prisma db push
```

### Option C: Apply Existing Migrations

If migrations already exist:

```bash
cd /workspace/backend
npx prisma migrate deploy
```

---

## 🎯 Step 7: Generate Prisma Client

Generate the Prisma Client (TypeScript types and query builder):

```bash
cd /workspace/backend
npx prisma generate
```

---

## ✅ Step 8: Verify Setup

### Check Database Connection:
```bash
cd /workspace/backend
npx prisma db pull
```

Should show: "Introspected X models from database"

### Open Prisma Studio (Database GUI):
```bash
cd /workspace/backend
npx prisma studio
```

Opens at: http://localhost:5555

You can:
- View all tables
- Add/edit/delete records
- Test the database visually

---

## 🔧 Quick Setup Script

Run all commands at once:

```bash
# Navigate to backend
cd /workspace/backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply migrations and create database
npx prisma migrate dev --name init

# Open Prisma Studio to verify
npx prisma studio
```

---

## 📊 Step 9: Seed Database (Optional)

Create a seed file to add initial data:

**Create:** `/workspace/backend/prisma/seed.js`

```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const clipperUser = await prisma.user.create({
    data: {
      name: 'Test Clipper',
      email: 'clipper@test.com',
      password: await bcrypt.hash('password123', 10),
      currentRole: 'clipper',
    },
  });

  const creatorUser = await prisma.user.create({
    data: {
      name: 'Test Creator',
      email: 'creator@test.com',
      password: await bcrypt.hash('password123', 10),
      currentRole: 'creator',
    },
  });

  // Create wallets
  await prisma.wallet.create({
    data: {
      userId: clipperUser.id,
      balance: 100,
    },
  });

  await prisma.wallet.create({
    data: {
      userId: creatorUser.id,
      balance: 500,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\nTest Accounts:');
  console.log('Clipper - clipper@test.com / password123');
  console.log('Creator - creator@test.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Update package.json:**
Add to "scripts":
```json
"seed": "node prisma/seed.js"
```

**Run seed:**
```bash
npm run seed
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
**Solution:**
1. Check PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```
2. Start PostgreSQL:
   ```bash
   sudo systemctl start postgresql
   ```

### Error: "Invalid connection string"
**Solution:**
- Check `.env` file `DATABASE_URL` format
- Verify username, password, host, port, database name

### Error: "database does not exist"
**Solution:**
```bash
sudo -u postgres psql -c "CREATE DATABASE clippa_db;"
```

### Error: "password authentication failed"
**Solution:**
- Check PostgreSQL user password
- Update `.env` DATABASE_URL with correct credentials

### Error: "prisma not found"
**Solution:**
```bash
npm install prisma --save-dev
npm install @prisma/client
```

### Reset Database (Development Only):
```bash
npx prisma migrate reset
```
⚠️ This deletes all data!

---

## 📱 Using With Docker (Alternative)

If you prefer Docker:

**Create:** `docker-compose.yml` in `/workspace/backend`

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: clippa_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: clippa_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Run:**
```bash
docker-compose up -d
```

**Stop:**
```bash
docker-compose down
```

---

## 🚀 Start Your Backend Server

After setup:

```bash
cd /workspace/backend
npm run dev
```

Server runs at: http://localhost:3000

---

## 📝 Prisma Commands Cheat Sheet

| Command | Description |
|---------|-------------|
| `npx prisma init` | Initialize Prisma in project |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema to database (no migration) |
| `npx prisma migrate dev` | Create and apply migration |
| `npx prisma migrate deploy` | Apply pending migrations |
| `npx prisma migrate reset` | Reset database (deletes data) |
| `npx prisma studio` | Open database GUI |
| `npx prisma db pull` | Pull schema from existing database |
| `npx prisma format` | Format schema file |
| `npx prisma validate` | Validate schema file |

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created (`clippa_db`)
- [ ] `.env` file configured with correct DATABASE_URL
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Migrations applied (`npx prisma migrate dev`)
- [ ] Can open Prisma Studio (`npx prisma studio`)
- [ ] Backend server starts successfully (`npm run dev`)

---

## 🎉 You're Ready!

Your database and Prisma are now set up. You can:
- Register new users with roles
- Login and switch between Clipper/Creator
- Start building your application!

**Need help?** Check the error messages and refer to the Troubleshooting section above.
