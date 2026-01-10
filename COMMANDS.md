# 📝 Command Cheat Sheet

## 🎯 Essential Commands for Running MedChain

---

## ✅ First Time Setup (Do Once)

### 1. Install Node.js
```
Download from: https://nodejs.org/
Version: 18 or higher
```

### 2. Navigate to Project
```bash
cd path/to/health-chain-secure-main
```

### 3. Install All Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 4. Setup Environment Variables
```bash
# Copy the example file
cp backend/.env.example backend/.env

# Then edit backend/.env with your settings
```

---

## 🚀 Running the Application (Every Time)

### You Need 2 Terminal Windows!

#### Terminal 1️⃣ - Backend Server
```bash
cd backend
npm run dev
```
**Wait for:** `✅ Server running on http://localhost:5000`

#### Terminal 2️⃣ - Frontend Server
```bash
npm run dev
```
**Wait for:** `➜ Local: http://localhost:8080/`

### Then Open Browser
```
http://localhost:8080/
```

---

## 🛑 Stopping the Application

In each terminal window:
```
Press: Ctrl + C
```

---

## 🔄 Common Development Commands

### Frontend Commands (from root directory)

| Command | What it does |
|---------|-------------|
| `npm install` | Install/update dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |

### Backend Commands (from backend/ directory)

| Command | What it does |
|---------|-------------|
| `npm install` | Install/update dependencies |
| `npm run dev` | Start dev server (auto-reload) |
| `npm start` | Start production server |

### Smart Contract Commands (from backend/ directory)

| Command | What it does |
|---------|-------------|
| `npx hardhat compile` | Compile smart contracts |
| `npx hardhat run scripts/deploy.js --network localhost` | Deploy to local network |
| `npx hardhat run scripts/deploy.js --network sepolia` | Deploy to Sepolia testnet |

---

## 🐛 Troubleshooting Commands

### Port Already in Use

**Kill Port 5000 (Backend):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or use npx
npx kill-port 5000
```

**Kill Port 8080 (Frontend):**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9

# Or use npx
npx kill-port 8080
```

### Clean Install (Fix Module Issues)

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Backend:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Reset Database
```bash
cd backend
rm database.sqlite
npm run dev  # Will recreate database
```

### Clear Cache
```bash
# Frontend
rm -rf node_modules/.vite

# Backend
rm -rf node_modules/.cache
```

---

## 📦 Package Management

### Update All Dependencies
```bash
# Frontend
npm update

# Backend
cd backend
npm update
```

### Install New Package
```bash
# Frontend
npm install package-name

# Backend
cd backend
npm install package-name
```

### Remove Package
```bash
# Frontend
npm uninstall package-name

# Backend
cd backend
npm uninstall package-name
```

---

## 🔍 Checking Status

### Check Node Version
```bash
node --version
# Should be v18 or higher
```

### Check npm Version
```bash
npm --version
```

### Check if Ports are Free
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :8080

# Mac/Linux
lsof -ti:5000
lsof -ti:8080
```

### View Running Processes
```bash
# Windows
tasklist

# Mac/Linux
ps aux
```

---

## 🌐 URLs to Remember

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080/ |
| Backend API | http://localhost:5000/ |
| API Health Check | http://localhost:5000/api/health |

---

## 📋 Quick Checklist

Before running the app, make sure:

- [ ] Node.js is installed (v18+)
- [ ] All dependencies are installed (`npm install` in both root and backend)
- [ ] `.env` file exists in `backend/` folder
- [ ] Ports 5000 and 8080 are free
- [ ] Two terminal windows are ready
- [ ] MetaMask extension is installed (for blockchain features)

---

## 💡 Pro Tips

1. **Keep terminals open** - Don't close the terminal windows while using the app
2. **Check logs** - If something breaks, check the terminal output for errors
3. **Auto-reload** - Both servers auto-reload when you save files
4. **Database location** - SQLite database is at `backend/database.sqlite`
5. **Environment variables** - Never commit `.env` file to Git

---

## 🆘 Emergency Commands

### Nuclear Option - Reset Everything
```bash
# Stop all servers (Ctrl+C in both terminals)

# Delete everything and start fresh
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm backend/database.sqlite

# Reinstall
npm install
cd backend && npm install && cd ..

# Restart servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: npm run dev
```

---

**Remember:** You need BOTH servers running at the same time! 🚀
