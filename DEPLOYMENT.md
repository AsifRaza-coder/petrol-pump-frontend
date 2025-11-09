# Frontend Deployment Guide - Vercel

## Step 1: Prepare Your Code

### 1.1 Ensure All Files Are Committed
```bash
cd frontend
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Create Vercel Account & Project

### 2.1 Sign Up/Login
- Go to https://vercel.com
- Sign up or login with GitHub

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select the repository containing your frontend code

## Step 3: Configure Vercel Project

### 3.1 Project Settings
- **Framework Preset**: `Create React App` (auto-detected)
- **Root Directory**: `frontend` (if frontend is in subfolder) or leave empty if root
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `build` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 3.2 Environment Variables (CRITICAL!)

Add these environment variables in Vercel dashboard:

```
REACT_APP_API_URL=https://your-backend.onrender.com
```

**Important**: 
- Replace `your-backend.onrender.com` with your actual Render backend URL
- No trailing slash at the end
- Use `https://` not `http://`

### 3.3 Advanced Settings
- **Node.js Version**: `18.x` or `20.x` (check your package.json)
- **Auto-Deploy**: `Yes` (deploys on every push)

## Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will start building and deploying
3. Wait for deployment to complete (3-5 minutes)
4. Copy your deployment URL (e.g., `https://petrol-pump.vercel.app`)

## Step 5: Update Backend CORS

After getting your Vercel URL:

1. Go to Render dashboard → Your backend service
2. Go to **Environment** tab
3. Update `FRONTEND_DOMAIN`:
   ```
   FRONTEND_DOMAIN=https://your-frontend.vercel.app
   ```
4. **Manual Deploy** → **Deploy latest commit**

Or update `backend/server.js` and add to `allowedOrigins`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://your-frontend.vercel.app', // Add your Vercel URL
  'https://your-backend.onrender.com',
  // ... other origins
];
```

## Step 6: Test Deployment

### 6.1 Test Frontend
1. Open your Vercel URL in browser
2. Check browser console (F12) for errors
3. Test login functionality

### 6.2 Test API Connection
1. Open browser console (F12)
2. Run: `window.checkBackend()` (if available)
3. Check Network tab for API calls

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node version compatibility
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

2. **API Connection Errors**
   - Verify `REACT_APP_API_URL` is set correctly
   - Check backend CORS settings
   - Ensure backend is running on Render

3. **CORS Errors**
   - Add Vercel URL to backend allowedOrigins
   - Set FRONTEND_DOMAIN in Render environment variables
   - Redeploy backend after CORS changes

4. **Environment Variables Not Working**
   - Vercel requires `REACT_APP_` prefix
   - Redeploy after adding environment variables
   - Check variable names are correct

5. **404 Errors on Refresh**
   - vercel.json already has rewrites configured ✓
   - Should work automatically

## Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Login functionality working
- [ ] API calls successful
- [ ] All pages accessible
- [ ] No console errors

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Update `REACT_APP_API_URL` if needed
5. Update backend CORS with new domain

