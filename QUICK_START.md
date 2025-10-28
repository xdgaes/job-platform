# 🚀 Quick Start Guide - Clipper & Creator Platform

Get up and running in 5 minutes!

---

## ⚡ Fast Setup (Copy & Paste)

### 1️⃣ Setup PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE clippa_db;"
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb clippa_db
```

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Install and run
3. Open pgAdmin and create database `clippa_db`

---

### 2️⃣ Setup Backend

```bash
# Navigate to backend
cd /workspace/backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply database migrations
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend runs at: **http://localhost:3000**

---

### 3️⃣ Setup Frontend

```bash
# Open new terminal
cd /workspace/frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend runs at: **http://localhost:5173** (or shown in terminal)

---

## 🎯 Test It Out

1. **Open browser:** http://localhost:5173
2. **Click "Register"**
3. **Choose role:** Clipper or Creator
4. **Fill in details:**
   - Name: Test User
   - Email: test@example.com
   - Password: password123
5. **Register and login!**
6. **Try switching roles** from your Profile page

---

## 🔑 Environment Variables (Already Set)

The `.env` file is created at `/workspace/backend/.env` with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clippa_db?schema=public"
JWT_SECRET="clippa-secret-key-2024-change-in-production"
PORT=3000
```

**⚠️ For production:** Change `JWT_SECRET` to a secure random string!

---

## 📊 View Database (Optional)

Open Prisma Studio to see your database:

```bash
cd /workspace/backend
npx prisma studio
```

Opens at: **http://localhost:5555**

---

## 🐛 Common Issues

### "Can't reach database server"
```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS
```

### "Database doesn't exist"
```bash
sudo -u postgres psql -c "CREATE DATABASE clippa_db;"
```

### "Port 3000 already in use"
```bash
# Change PORT in /workspace/backend/.env
PORT=3001
```

### "Prisma Client not found"
```bash
cd /workspace/backend
npx prisma generate
```

---

## 📁 Project Structure

```
/workspace
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── routes/             # API routes
│   │   └── middleware/         # Auth & error handling
│   ├── .env                    # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/              # React pages
    │   ├── components/         # Reusable components
    │   ├── context/            # State management
    │   └── api/                # API calls
    └── package.json
```

---

## 🎨 Features Implemented

✅ User registration with role selection (Clipper/Creator)
✅ Login with role persistence
✅ Switch roles from profile page
✅ Beautiful UI with dark mode
✅ JWT authentication
✅ PostgreSQL database with Prisma ORM
✅ Wallet system
✅ Job posting system

---

## 📖 Full Documentation

- **Database Setup:** See `/workspace/DATABASE_SETUP.md`
- **Dual Role System:** See `/workspace/DUAL_ROLE_IMPLEMENTATION.md`

---

## ✅ All Set!

You're ready to start developing! 🎉

**Next Steps:**
- Customize the UI in `/workspace/frontend/src/`
- Add new features in `/workspace/backend/src/`
- Deploy to production when ready

Happy coding! 💻
