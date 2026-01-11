# HealthChain Secure - Deployment Guide

This guide will walk you through deploying the HealthChain Secure application with the **frontend on Vercel** and the **backend on Render**.

## Prerequisites

- GitHub account
- Vercel account ([vercel.com](https://vercel.com))
- Render account ([render.com](https://render.com))
- Your code pushed to a GitHub repository

---

## Part 1: Deploy Backend to Render

### Step 1: Create a New Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `health-chain-secure-main` repository

### Step 2: Configure the Service

Use these settings:

| Setting | Value |
|---------|-------|
| **Name** | `healthchain-backend` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Step 3: Configure Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render's default port |
| `JWT_SECRET` | `<generate-random-string>` | **IMPORTANT**: Use a strong random string |
| `DB_PATH` | `/var/data/database.sqlite` | Path to persistent disk |
| `FRONTEND_URL` | `<leave-empty-for-now>` | Will update after Vercel deployment |

> [!IMPORTANT]
> **Generate a secure JWT_SECRET**: Use a password generator or run this command locally:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Step 4: Add Persistent Disk (Important!)

1. Scroll to **"Disks"** section
2. Click **"Add Disk"**
3. Configure:
   - **Name**: `healthchain-data`
   - **Mount Path**: `/var/data`
   - **Size**: `1 GB` (free tier)

> [!WARNING]
> Without a persistent disk, your SQLite database will be reset on every deployment!

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (5-10 minutes)
3. Once deployed, copy your backend URL: `https://your-service-name.onrender.com`

### Step 6: Test Backend

Visit your backend URL in a browser. You should see:
```json
{"message": "MedChain Backend API is running"}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create New Project

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select `health-chain-secure-main`

### Step 2: Configure Build Settings

Vercel should auto-detect Vite. Verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` (project root) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-name.onrender.com` |

> [!TIP]
> Replace `your-backend-name` with your actual Render service name from Part 1, Step 5.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

---

## Part 3: Update Backend CORS

Now that you have your Vercel URL, update the backend to allow requests from your frontend:

1. Go back to **Render Dashboard**
2. Select your `healthchain-backend` service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` variable:
   - **Value**: `https://your-project.vercel.app`
5. Click **"Save Changes"**
6. Your service will automatically redeploy

---

## Part 4: Initialize Database (First Time Only)

The database needs to be initialized with tables. You have two options:

### Option A: Use the Development Token Feature

1. Visit your deployed frontend: `https://your-project.vercel.app`
2. Go to the login page
3. The backend will automatically create tables on first API call

### Option B: Manual Initialization (Recommended)

1. In Render Dashboard, go to your service
2. Click **"Shell"** tab (opens a terminal)
3. Run:
```bash
cd backend
node -e "require('./database.js').initDatabase()"
```

---

## Part 5: Verification

### Test the Application

1. **Visit your frontend**: `https://your-project.vercel.app`
2. **Register a new account**:
   - Try registering as a Patient
   - Check if registration succeeds
3. **Login**:
   - Use your registered credentials
   - Verify you can access the dashboard
4. **Test MetaMask** (if applicable):
   - Connect your wallet
   - Verify blockchain features work

### Check Backend Logs

If something doesn't work:

1. Go to Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Look for error messages

---

## Environment Variables Reference

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend-name.onrender.com
```

### Backend (Render)

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=<your-secure-random-string>
DB_PATH=/var/data/database.sqlite
FRONTEND_URL=https://your-project.vercel.app
```

### Optional Backend Variables

```env
# Blockchain (if deploying smart contracts)
PRIVATE_KEY=<your-ethereum-wallet-private-key>
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<your-infura-project-id>

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

---

## Troubleshooting

### Frontend Issues

#### "Failed to fetch" or CORS errors

**Problem**: Frontend can't connect to backend.

**Solutions**:
1. Verify `VITE_API_URL` in Vercel environment variables
2. Check `FRONTEND_URL` is set correctly in Render
3. Ensure backend is running (visit backend URL directly)
4. Check browser console for exact error

#### Build fails on Vercel

**Problem**: Build command fails.

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify `package.json` scripts are correct
3. Try building locally: `npm run build`
4. Check for TypeScript errors

### Backend Issues

#### Database resets on deployment

**Problem**: Data disappears after redeploying.

**Solution**: Verify persistent disk is configured:
- Mount Path: `/var/data`
- DB_PATH: `/var/data/database.sqlite`

#### "Cannot find module" errors

**Problem**: Missing dependencies.

**Solutions**:
1. Verify `backend/package.json` exists
2. Check build command is `npm install`
3. Review Render build logs

#### Authentication fails

**Problem**: Login/register doesn't work.

**Solutions**:
1. Check `JWT_SECRET` is set in Render
2. Verify database is initialized
3. Check backend logs for errors
4. Test backend API directly: `https://your-backend.onrender.com/api/auth/login`

### Database Issues

#### Tables don't exist

**Problem**: "no such table" errors.

**Solution**: Initialize database (see Part 4)

#### Can't write to database

**Problem**: Permission errors.

**Solutions**:
1. Verify persistent disk is mounted
2. Check `DB_PATH` points to `/var/data/database.sqlite`
3. Review Render logs for permission errors

---

## Performance Notes

### Render Free Tier

> [!WARNING]
> Render's free tier services **spin down after 15 minutes of inactivity**. The first request after spin-down will take 30-60 seconds to respond.

**Solutions**:
- Upgrade to paid tier for always-on service
- Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 10 minutes
- Accept the cold start delay for free tier

### Vercel Free Tier

- Excellent performance
- No cold starts
- Generous bandwidth limits

---

## Updating Your Deployment

### Update Frontend

1. Push changes to GitHub
2. Vercel automatically rebuilds and deploys
3. No additional steps needed

### Update Backend

1. Push changes to GitHub
2. Render automatically rebuilds and deploys
3. **Note**: Service will restart (30-60 seconds downtime)

---

## Security Checklist

- [ ] `JWT_SECRET` is a strong random string (not the example value)
- [ ] Never commit `.env` files to GitHub
- [ ] `FRONTEND_URL` is set correctly to prevent CORS issues
- [ ] Blockchain private keys (if used) are kept secure
- [ ] Database has persistent disk configured

---

## Need Help?

### Common Commands

**Test backend locally:**
```bash
cd backend
npm install
npm start
```

**Test frontend locally:**
```bash
npm install
npm run dev
```

**Generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Next Steps

After successful deployment:

1. **Custom Domain** (Optional):
   - Add custom domain in Vercel settings
   - Update `FRONTEND_URL` in Render

2. **Monitoring**:
   - Set up Render alerts
   - Monitor Vercel analytics

3. **Database Backup**:
   - Regularly backup your SQLite database from Render disk
   - Consider migrating to PostgreSQL for production

4. **SSL/HTTPS**:
   - Both Vercel and Render provide free SSL certificates
   - Verify HTTPS is working

---

**Congratulations!** 🎉 Your HealthChain Secure application is now deployed and accessible worldwide!
