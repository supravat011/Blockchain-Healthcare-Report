# 🏥 MedChain - Setup Guide for New Device

This guide will help you set up and run the MedChain blockchain healthcare application on a new device.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your device:

### Required Software:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **MetaMask Browser Extension** (for blockchain interaction)
   - Install from: https://metamask.io/

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Clone or Copy the Project

**Option A: If using Git**
```bash
git clone <your-repository-url>
cd health-chain-secure-main
```

**Option B: If copying files manually**
- Copy the entire `health-chain-secure-main` folder to your new device
- Open terminal/command prompt and navigate to the folder:
```bash
cd path/to/health-chain-secure-main
```

---

### Step 2: Install Frontend Dependencies

```bash
# Make sure you're in the root directory (health-chain-secure-main)
npm install
```

This will install all the React frontend dependencies. It may take a few minutes.

---

### Step 3: Install Backend Dependencies

```bash
# Navigate to the backend folder
cd backend

# Install backend dependencies
npm install
```

This will install all the Node.js backend dependencies including Express, SQLite, etc.

---

### Step 4: Set Up Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# While in the backend folder
# For Windows (PowerShell):
New-Item .env

# For Mac/Linux:
touch .env
```

Open the `.env` file and add the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Database
DB_PATH=./database.sqlite

# Blockchain Configuration (optional - for smart contract deployment)
PRIVATE_KEY=your_ethereum_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
```

> ⚠️ **Important**: Replace `your_super_secret_jwt_key_change_this_in_production` with a strong random string!

---

### Step 5: Initialize the Database

The database will be automatically created when you first run the backend server. No manual setup needed!

---

### Step 6: Run the Application

You need to run **both** the frontend and backend servers.

#### Terminal 1 - Start Backend Server

```bash
# Navigate to backend folder (if not already there)
cd backend

# Start the backend development server
npm run dev
```

You should see:
```
✅ Database initialized successfully
🚀 Server running on http://localhost:5000
```

#### Terminal 2 - Start Frontend Server

Open a **new terminal window/tab** and run:

```bash
# Navigate to the root directory
cd path/to/health-chain-secure-main

# Start the frontend development server
npm run dev
```

You should see:
```
VITE v5.4.19  ready in xxxx ms
➜  Local:   http://localhost:8080/
```

---

### Step 7: Access the Application

Open your web browser and go to:
```
http://localhost:8080/
```

🎉 **Your MedChain application should now be running!**

---

## 🔧 Common Commands Reference

### Frontend Commands (run from root directory)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Backend Commands (run from backend directory)

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

### Smart Contract Commands (run from backend directory)

```bash
# Compile smart contracts
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🛠️ Troubleshooting

### Issue: Port Already in Use

**Frontend (Port 8080):**
```bash
# Find and kill the process using port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8080 | xargs kill -9
```

**Backend (Port 5000):**
```bash
# Find and kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: Module Not Found

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database Errors

```bash
# Delete the database and let it recreate
cd backend
rm database.sqlite
# Restart the backend server
npm run dev
```

### Issue: CORS Errors

Make sure the backend `.env` file has the correct configuration and both servers are running.

---

## 📁 Project Structure

```
health-chain-secure-main/
├── backend/                 # Backend server
│   ├── contracts/          # Smart contracts
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── scripts/            # Deployment scripts
│   ├── server.js           # Main server file
│   ├── database.js         # Database configuration
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables (create this)
│
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities
│   └── App.tsx            # Main app component
│
├── public/                # Static assets
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite configuration
└── index.html            # HTML entry point
```

---

## 🔐 Default Test Accounts

After the database is initialized, you can create test accounts through the registration page or use the API directly.

---

## 📝 Important Notes

1. **Keep both servers running** - The frontend (port 8080) and backend (port 5000) must both be running
2. **Environment variables** - Make sure to create the `.env` file in the backend folder
3. **MetaMask** - Install MetaMask browser extension for blockchain features
4. **Node version** - Use Node.js v18 or higher for best compatibility
5. **Database** - SQLite database file will be created automatically in `backend/database.sqlite`

---

## 🆘 Need Help?

If you encounter any issues:
1. Check that all dependencies are installed (`npm install`)
2. Verify both servers are running
3. Check the console for error messages
4. Make sure ports 5000 and 8080 are not in use
5. Ensure `.env` file is properly configured

---

## 📞 Quick Start Checklist

- [ ] Node.js installed (v18+)
- [ ] Project files copied/cloned
- [ ] Frontend dependencies installed (`npm install` in root)
- [ ] Backend dependencies installed (`npm install` in backend)
- [ ] `.env` file created in backend folder
- [ ] Backend server running (`npm run dev` in backend)
- [ ] Frontend server running (`npm run dev` in root)
- [ ] Browser opened to http://localhost:8080/
- [ ] MetaMask extension installed

---

**Happy Coding! 🚀**
