# 🏥 MedChain - Blockchain Medical Report Security System

A comprehensive blockchain-based medical report security system for secure, patient-controlled management of medical data with role-based access for patients, doctors, and hospitals.

---

## 🚀 Quick Start

### For New Users - Setup on Any Device

**See detailed guides:**
- 📖 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete step-by-step setup instructions
- ⚡ **[QUICK_START.md](./QUICK_START.md)** - Quick command reference

### TL;DR - Run These Commands

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Create backend/.env file (copy from backend/.env.example)
cp backend/.env.example backend/.env

# 3. Start backend (Terminal 1)
cd backend
npm run dev

# 4. Start frontend (Terminal 2)
npm run dev
```

**Then open:** http://localhost:8080/

---

## 📋 Prerequisites

- **Node.js** v18 or higher - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MetaMask** browser extension - [Install](https://metamask.io/)

---

## 🛠️ Technologies Used

### Frontend
- **React** 18.3 - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

### Blockchain
- **Hardhat** - Smart contract development
- **Ethers.js** - Blockchain interaction
- **Solidity** - Smart contract language

---

## 📁 Project Structure

```
health-chain-secure-main/
├── backend/                 # Backend server
│   ├── contracts/          # Solidity smart contracts
│   │   ├── MedicalRecords.sol
│   │   └── AccessControl.sol
│   ├── routes/             # API endpoints
│   │   ├── auth.js
│   │   ├── reports.js
│   │   ├── diagnosis.js
│   │   └── activity.js
│   ├── middleware/         # Express middleware
│   ├── scripts/            # Deployment scripts
│   ├── server.js           # Main server file
│   ├── database.js         # Database configuration
│   └── .env.example        # Environment variables template
│
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities
│   └── App.tsx            # Main app
│
├── SETUP_GUIDE.md         # Detailed setup instructions
├── QUICK_START.md         # Quick command reference
└── README.md              # This file
```

---

## 🎯 Features

### For Patients
- 🔐 Secure registration and login
- 📊 Personal health dashboard
- 📄 Upload and manage medical reports
- 🔑 Grant/revoke access to doctors
- 📈 View health analytics
- 🔔 Activity notifications

### For Doctors
- 👥 Patient management
- 📋 View authorized medical records
- 💊 Add diagnoses and prescriptions
- 📊 Patient health overview
- 🔍 Search patient records

### For Hospitals
- 🏥 Multi-patient management
- 📈 Analytics dashboard
- 👨‍⚕️ Doctor management
- 📊 Report generation
- 🔐 Secure data access

### Blockchain Features
- 🔗 Immutable medical record storage
- 🔐 Decentralized access control
- ✅ Audit trail for all access
- 🛡️ Enhanced data security

---

## 🔧 Available Scripts

### Frontend (Root Directory)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend (backend/ Directory)

```bash
npm run dev      # Start dev server with auto-reload
npm start        # Start production server
```

### Smart Contracts (backend/ Directory)

```bash
npx hardhat compile                              # Compile contracts
npx hardhat run scripts/deploy.js --network localhost   # Deploy locally
npx hardhat run scripts/deploy.js --network sepolia     # Deploy to testnet
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Medical Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Upload new report
- `GET /api/reports/:id` - Get specific report
- `DELETE /api/reports/:id` - Delete report

### Diagnosis
- `POST /api/diagnosis` - Add diagnosis
- `GET /api/diagnosis/:patientId` - Get patient diagnoses

### Activity
- `GET /api/activity` - Get user activity log

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
DB_PATH=./database.sqlite
PRIVATE_KEY=your_ethereum_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
```

See `backend/.env.example` for a complete template.

---

## 🚀 Deployment

### Frontend Deployment
- **Recommended**: Vercel, Netlify, or GitHub Pages
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for deployment instructions

### Backend Deployment
- **Recommended**: Render, Railway, or Fly.io
- Requires Node.js hosting with persistent storage for SQLite

### Smart Contracts
- **Testnet**: Sepolia, Goerli
- **Mainnet**: Ethereum, Polygon, BSC

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 8080 (frontend)
npx kill-port 8080
```

### Database Issues
```bash
# Delete and recreate database
cd backend
rm database.sqlite
npm run dev  # Database will be recreated
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 License

This project is for educational purposes as a final year college project.

---

## 👥 Support

For issues or questions:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Check [QUICK_START.md](./QUICK_START.md)
3. Review error messages in terminal
4. Ensure all prerequisites are installed

---

## 🎓 Academic Project

This is a final year college project demonstrating:
- Full-stack web development
- Blockchain integration
- Healthcare data management
- Role-based access control
- Secure authentication

---

**Built with ❤️ for secure healthcare data management**
