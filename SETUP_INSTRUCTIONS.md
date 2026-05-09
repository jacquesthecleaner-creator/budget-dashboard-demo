# Setup Instructions - Household Budget Dashboard

Complete setup guide to get your budget dashboard running locally and deployed to Vercel.

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn
- ✅ Git installed
- ✅ GitHub account
- ✅ Google Cloud Project access
- ✅ Anthropic API account

## 🚀 Phase 1: Google Cloud Setup (10 minutes)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Create Project"
3. Name it "Budget Dashboard" 
4. Click "Create"
5. Wait for project to be created

### Step 2: Enable Google Sheets API
1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and select **Enable**
4. You should see "API enabled" confirmation

### Step 3: Create Service Account
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"Service Account"**
3. Fill in:
   - Service account name: "budget-dashboard"
   - Service account ID: auto-filled
   - Description: "Service account for budget tracking app"
4. Click **"Create and Continue"**
5. On the next page, skip the optional steps
6. Click **"Done"**

### Step 4: Generate Private Key
1. In the Service Accounts list, click on your newly created account
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **"JSON"** format
5. Click **"Create"**
6. **A JSON file will download** - Save this file securely!
7. This file contains your service account email and private key

### Step 5: Share Google Sheet
1. Open your budget spreadsheet: 
   https://docs.google.com/spreadsheets/d/1i4fV-iOfDpe_nS3BW5KmvyFH4g2Z2ysJKEpFZWz-YyU/edit?usp=drivesdk

2. Click the **"Share"** button (top right)
3. Open the JSON file you downloaded earlier
4. Copy the `"client_email"` value (looks like: `budget-dashboard@project.iam.gserviceaccount.com`)
5. Paste it in the Share dialog
6. Give it **"Editor"** permissions
7. Click **"Share"**

**✅ Google Cloud Setup Complete!**

---

## 🔑 Phase 2: Get API Keys (5 minutes)

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Click **"API Keys"** in the sidebar
4. Click **"Create Key"**
5. Copy and save it (you won't see it again!)
6. Label it "Budget Dashboard"

**✅ API Keys Ready!**

---

## 💻 Phase 3: Local Setup (5 minutes)

### Step 1: Install Dependencies
```bash
# Navigate to the project directory
cd budget-dashboard

# Install all dependencies
npm install
```

### Step 2: Create Environment File
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit it with your credentials
nano .env.local  # or your favorite editor
```

### Step 3: Fill in Environment Variables

Open `.env.local` and fill in:

```env
# 1. GOOGLE SHEETS ID (from the spreadsheet URL)
GOOGLE_SHEETS_SPREADSHEET_ID=1i4fV-iOfDpe_nS3BW5KmvyFH4g2Z2ysJKEpFZWz-YyU

# 2. GOOGLE SERVICE ACCOUNT EMAIL (from your JSON file)
GOOGLE_SERVICE_ACCOUNT_EMAIL=budget-dashboard@project.iam.gserviceaccount.com

# 3. GOOGLE PRIVATE KEY (from your JSON file)
# Open the JSON file, find "private_key"
# Copy the entire value, but replace actual \n with literal \n
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQI...\n-----END PRIVATE KEY-----

# 4. ANTHROPIC API KEY
ANTHROPIC_API_KEY=sk-ant-v0-...

# 5. Dashboard login password (create something secure!)
DASHBOARD_PASSWORD=MySecurePassword123!

# 6. JWT Secret (random string for token signing)
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# 7. Keep these defaults for local development
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

**Important:** For `GOOGLE_PRIVATE_KEY`:
- Open the JSON file you downloaded
- Find the `"private_key"` field
- It will look like: `"-----BEGIN PRIVATE KEY-----\nMIIEv...` (with `\n` for newlines)
- Copy the entire value as-is
- Paste it in `.env.local`

### Step 4: Verify Setup
```bash
# Check that Node.js is installed
node --version  # Should be v18+

# Check npm
npm --version
```

### Step 5: Start Development Server
```bash
npm run dev
```

You should see:
```
> next dev
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

### Step 6: Test Login
1. Open `http://localhost:3000`
2. Login with:
   - User: **Andy** or **Aileen**
   - Password: **Your DASHBOARD_PASSWORD**
3. You should see the dashboard!

**✅ Local Setup Complete!**

---

## 🌐 Phase 4: Deploy to Vercel (10 minutes)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial budget dashboard setup"

# Create GitHub repository
# Go to https://github.com/new
# Name it "budget-dashboard"
# Copy the commands to push existing repository
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/budget-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI (optional, can also use web)
npm i -g vercel

# Deploy
vercel
```

Or use the web interface:
1. Go to [Vercel](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Vercel will auto-detect Next.js
5. Click **"Deploy"**

### Step 3: Add Environment Variables in Vercel

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:

```
GOOGLE_SHEETS_SPREADSHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
ANTHROPIC_API_KEY
DASHBOARD_PASSWORD
JWT_SECRET
NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
```

### Step 4: Redeploy

1. Go to **Deployments** in Vercel
2. Click on the latest deployment
3. Click the **"Redeploy"** button (refresh icon)
4. Wait for deployment to complete

### Step 5: Test Production

1. Visit your Vercel domain
2. Login with your credentials
3. Upload a test receipt
4. Verify Google Sheets updated

**✅ Production Deployment Complete!**

---

## 🧪 Testing

### Test Receipt Upload
1. Take a photo of a receipt or use a sample receipt image
2. Click "Submit Receipt"
3. Upload the image
4. Verify extracted data:
   - Date extracted correctly?
   - Amount correct?
   - Merchant name captured?
   - Category suggested appropriately?
5. Confirm and check Google Sheets

### Test Google Sheets Integration
1. Open your Google Sheet
2. Navigate to the current month sheet (e.g., "May 2024")
3. Look for your test transaction in the rows
4. Verify format: Date | Amount | Category | Subcategory | Description

### Test Dashboard
1. Go to dashboard
2. Verify summary shows correct totals
3. Charts should display spending by category
4. Transaction list should show all entries

---

## ❌ Troubleshooting

### "Cannot GET /api/auth/login"
- Make sure `npm install` completed successfully
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "Invalid credentials" on login
- Check `DASHBOARD_PASSWORD` in `.env.local`
- Make sure it's set to something non-empty

### "Missing Google credentials"
- Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` are set
- Check that private key has correct format with `\n` for newlines
- Restart dev server after changing `.env.local`

### Google Sheets not updating
- Verify service account email was invited to spreadsheet with Editor access
- Check sheet name matches format: `MonthName Year` (e.g., "May 2024")
- Verify column order: Date | Amount | Category | Subcategory | Description

### OCR not extracting correctly
- Ensure receipt photo is clear and readable
- Check `ANTHROPIC_API_KEY` is valid in Vercel
- Receipt must have visible: date, amount, merchant name

### "Unauthorized" on dashboard
- Check auth token in browser cookies
- Try clearing cookies and logging in again
- Verify `JWT_SECRET` is set in production

---

## 📚 Next Steps

1. **Read QUICKSTART.md** - Fast reference guide
2. **Read ARCHITECTURE.md** - Understand how the system works
3. **Read README.md** - Full feature documentation
4. **Read DEPLOYMENT.md** - Detailed deployment guide

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm start` |
| Deploy to Vercel | `vercel` |
| Check TypeScript | `npm run type-check` |

## 🔗 Important Links

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Anthropic Claude Docs](https://docs.anthropic.com)
- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**🎉 You're all set! Your budget dashboard is ready to use.**

Questions? Check the README.md and ARCHITECTURE.md for more details.

Happy budgeting! 💰
