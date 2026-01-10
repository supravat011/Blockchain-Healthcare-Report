# ⚡ Quick Start Commands

## 🎯 For Someone Setting Up on a New Device

### 1️⃣ Install Node.js
Download and install from: https://nodejs.org/ (v18 or higher)

### 2️⃣ Copy Project Files
Copy the entire `health-chain-secure-main` folder to your device

### 3️⃣ Open Terminal and Run These Commands

```bash
# Navigate to project folder
cd path/to/health-chain-secure-main

# Install frontend dependencies
npm install

# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Create .env file (Windows PowerShell)
New-Item .env

# OR for Mac/Linux
touch .env
```

### 4️⃣ Edit the .env File

Open `backend/.env` and add:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=change_this_to_random_secret_key_12345
DB_PATH=./database.sqlite
```

### 5️⃣ Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# Open new terminal
cd path/to/health-chain-secure-main
npm run dev
```

### 6️⃣ Open Browser
Go to: **http://localhost:8080/**

---

## 📝 Summary of All Commands

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend
npm install

# 3. Create .env file
New-Item .env    # Windows
touch .env       # Mac/Linux

# 4. Start backend (Terminal 1)
cd backend
npm run dev

# 5. Start frontend (Terminal 2)
npm run dev
```

---

## ✅ What You Need

1. **Node.js** (v18+) - https://nodejs.org/
2. **Two terminal windows** - One for backend, one for frontend
3. **Web browser** - Chrome, Firefox, Edge, etc.
4. **MetaMask** (optional) - For blockchain features

---

## 🔥 That's It!

Your application will be running at:
- **Frontend**: http://localhost:8080/
- **Backend**: http://localhost:5000/

Both servers must be running at the same time!
