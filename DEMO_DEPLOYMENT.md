# Demo Deployment Guide

This document provides step-by-step instructions to deploy the Budget Dashboard demo to Vercel.

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

1. Go to: https://vercel.com/new
2. Import the GitHub repository: `jacquesthecleaner-creator/budget-dashboard-demo`
3. Configure environment variables (see below)
4. Click "Deploy"

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Navigate to project directory
cd /path/to/budget-dashboard

# Login to Vercel (will open browser for authentication)
vercel login

# Deploy project
vercel

# Follow the prompts and enter the environment variables when asked
```

## Environment Variables for Demo Mode

Set these environment variables in your Vercel project settings:

```
# Demo Mode
DEMO_MODE=true

# Dashboard Authentication (IMPORTANT: Change in production!)
DASHBOARD_PASSWORD=demo123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Sheets (Optional for demo, required for real data)
# The demo mode doesn't require these, but set dummy values to prevent errors:
GOOGLE_SHEETS_SPREADSHEET_ID=dummy-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=dummy@example.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE\n-----END PRIVATE KEY-----

# Anthropic API (Optional for demo, required for OCR)
ANTHROPIC_API_KEY=dummy-key

# Optional: Telegram Bot
TELEGRAM_BOT_TOKEN=dummy-token
TELEGRAM_WEBHOOK_SECRET=dummy-secret

# Node Environment
NODE_ENV=production
```

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard

Visit https://vercel.com/dashboard

### 2. Create New Project

- Click "Add New" → "Project"
- Select "Import Git Repository"
- Search for `budget-dashboard-demo`
- Select the repository from `jacquesthecleaner-creator` account

### 3. Configure Project

- Project Name: `budget-dashboard-demo` (or your preferred name)
- Framework: Next.js (should be auto-detected)
- Root Directory: `./` (default)

### 4. Add Environment Variables

Click "Environment Variables" and add each variable above with the specified values:

**Critical for Demo:**
- `DEMO_MODE=true` (enables mock data)
- `DASHBOARD_PASSWORD=demo123` (demo login password)
- `JWT_SECRET=change-this-secret-key` (any random string)

**Dummy Values (to prevent build errors):**
- `GOOGLE_SHEETS_SPREADSHEET_ID=dummy-id`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL=dummy@example.com`
- `GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE\n-----END PRIVATE KEY-----`
- `ANTHROPIC_API_KEY=dummy-key`
- `TELEGRAM_BOT_TOKEN=dummy-token`
- `TELEGRAM_WEBHOOK_SECRET=dummy-secret`
- `NODE_ENV=production`

### 5. Deploy

Click "Deploy" and wait for the build to complete (usually ~2-3 minutes)

## Demo Access Details

### Default Credentials

**Username:** demo@example.com (optional - not actually used in login)  
**Password:** demo123

### Sample Data Included

The demo includes realistic transaction data for:
- **April 2026:** Groceries, Fuel, Utilities, Entertainment, Healthcare
- **May 2026:** Same categories with updated amounts

### Features Available in Demo

✅ **Full Dashboard Functionality:**
- Real-time budget visualization
- Spending by category (pie chart)
- Category comparison (bar chart)
- Transaction history with sortable columns
- Month/year selector
- Responsive mobile design

✅ **Demo Data:**
- April & May 2026 transactions
- Realistic amounts for each category
- Full transaction details

⚠️ **Not Available in Demo:**
- Receipt OCR (no API key provided)
- Google Sheets integration (no credentials provided)
- Telegram bot integration (no token provided)
- New transaction uploads

## Verification

After deployment, verify:

1. **Check Deployment Status**
   - Go to Vercel dashboard
   - Project should show "Ready" status
   - Domain should be active (looks like `budget-dashboard-demo.vercel.app`)

2. **Test Login Page**
   - Visit your domain URL
   - Should see login form
   - Enter password: `demo123`

3. **Verify Dashboard**
   - After login, should see dashboard with data
   - Charts should display
   - Transactions for April 2026 should show
   - Use month/year selector to switch to May 2026

4. **Test Navigation**
   - Click logout and log back in
   - Switch between months
   - Verify charts update
   - Check responsive design on mobile

## Troubleshooting

### Build Fails
- Verify all environment variables are set correctly
- Check that `DEMO_MODE=true` is configured
- Look at build logs in Vercel dashboard for specific errors

### Login Doesn't Work
- Verify `DASHBOARD_PASSWORD=demo123` is set exactly
- Try clearing browser cookies
- Check browser console for errors

### No Data Shows
- Verify `DEMO_MODE=true` is set
- Check Vercel logs: "Environment Variables"
- Ensure you're looking at April or May 2026

### Charts Don't Render
- Check browser console for errors
- Verify JavaScript is enabled
- Try different browser

## Next Steps

### To Convert to Production:

1. **Get Google Credentials**
   - Follow SETUP_INSTRUCTIONS.md
   - Generate service account key
   - Update GOOGLE_* environment variables

2. **Set Real Credentials**
   - Generate Anthropic API key
   - Generate Telegram bot token (optional)
   - Create strong JWT_SECRET
   - Create strong DASHBOARD_PASSWORD

3. **Set DEMO_MODE to false**
   - Update environment variable in Vercel
   - This will use real Google Sheets data

4. **Create Google Sheets Budget Tracker**
   - Format: Date | Amount | Category | Subcategory | Description
   - One sheet per month (e.g., "April 2026")
   - Share with service account email

## Support

For issues or questions:
- Check build logs in Vercel dashboard
- Review DEPLOYMENT.md for detailed setup
- Check ARCHITECTURE.md for technical details

---

**Your Demo Dashboard URL:** `https://[your-project-name].vercel.app`

**Demo Login:** `demo123`

**Sample Data:** April & May 2026 with realistic transactions
