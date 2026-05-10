# Deploy Budget Dashboard Demo to Vercel - Quick Start

This guide will have you deployed in **5 minutes**.

## ⚡ Quick Start (Copy & Paste)

The project is ready to deploy. Follow one of these methods:

## Method 1: Deploy Button (Easiest)

Click this button to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jacquesthecleaner-creator/budget-dashboard-demo&env=DEMO_MODE,DASHBOARD_PASSWORD,JWT_SECRET&envDescription=Demo%20mode%20configuration&envLink=https://github.com/jacquesthecleaner-creator/budget-dashboard-demo&project-name=budget-dashboard-demo&repository-name=budget-dashboard-demo)

**What it does:**
1. Clones the repository to your GitHub account
2. Creates a new Vercel project
3. Sets up required environment variables
4. Deploys automatically

**After clicking:**
- Wait ~3 minutes for build to complete
- Vercel will give you the live URL
- Login with password: `demo123`

---

## Method 2: Vercel Dashboard (Full Control)

### Step 1: Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### Step 2: Create New Project
1. Click "Add New" → "Project"
2. Click "Import Git Repository"
3. Enter: `https://github.com/jacquesthecleaner-creator/budget-dashboard-demo`
4. Click "Import"

### Step 3: Configure Project
- **Project Name:** `budget-dashboard-demo`
- **Framework:** Next.js (auto-detected)
- **Root Directory:** `./` (default)

### Step 4: Add Environment Variables

Click "Environment Variables" and add these:

```
DEMO_MODE = true
DASHBOARD_PASSWORD = demo123
JWT_SECRET = your-secret-key-change-this
GOOGLE_SHEETS_SPREADSHEET_ID = dummy-id
GOOGLE_SERVICE_ACCOUNT_EMAIL = dummy@example.com
GOOGLE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE\n-----END PRIVATE KEY-----
ANTHROPIC_API_KEY = dummy-key
NODE_ENV = production
```

### Step 5: Deploy
Click the "Deploy" button and wait!

**Deployment takes 2-5 minutes depending on Vercel's load.**

---

## Method 3: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd /path/to/budget-dashboard

# Deploy (interactive)
vercel --env DEMO_MODE=true --env DASHBOARD_PASSWORD=demo123 --env JWT_SECRET=demo-jwt-secret --env GOOGLE_SHEETS_SPREADSHEET_ID=dummy --env GOOGLE_SERVICE_ACCOUNT_EMAIL=dummy@example.com --env GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE\n-----END PRIVATE KEY-----" --env ANTHROPIC_API_KEY=dummy --env NODE_ENV=production
```

---

## After Deployment ✅

### 1. Find Your URL
After deployment, Vercel will show your live URL:
- Format: `https://[project-name].vercel.app`
- Example: `https://budget-dashboard-demo.vercel.app`

### 2. Test Login
1. Visit your URL
2. You should see a login page
3. Enter password: **`demo123`**
4. Click "Login"

### 3. Explore Dashboard
You should see:
- ✅ Budget summary cards (Income, Expenses, Net)
- ✅ Pie chart showing spending by category
- ✅ Bar chart comparing categories
- ✅ Transaction history table
- ✅ Month/year selector (try April & May 2026)
- ✅ Fully responsive design

---

## Demo Account Credentials

| Field | Value |
|-------|-------|
| **Password** | `demo123` |
| **Data** | April & May 2026 |
| **Sample Categories** | Groceries, Fuel, Utilities, Entertainment, Healthcare |

---

## What's Included in Demo

### Sample Transactions
- **April 2026:** ~20 transactions across 5 categories
- **May 2026:** ~20 transactions across 5 categories
- Realistic amounts (groceries ~$80-120, fuel ~$50-55, etc.)

### Full Dashboard Features
✅ Real-time data visualization  
✅ Category breakdown charts  
✅ Transaction history  
✅ Month/year navigation  
✅ Mobile responsive design  
✅ Secure password login  

### Not in Demo (Production Features)
⚠️ Receipt OCR (requires Anthropic API key)  
⚠️ Google Sheets integration (requires credentials)  
⚠️ Telegram bot (requires bot token)  

---

## Share Your Deployment

Once deployed, you can share the URL:

```
"Check out my Budget Dashboard demo!"
https://[your-project].vercel.app

Login: demo123
```

---

## Troubleshooting

### Deployment Failed
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure GitHub repository is public

### Login Shows "Invalid Password"
- Verify `DASHBOARD_PASSWORD=demo123` is set correctly
- Check for typos in environment variables
- Clear browser cookies and try again

### No Data Shows
- Make sure `DEMO_MODE=true` is set
- Try selecting April or May 2026
- Check browser console for errors

### Charts Don't Load
- Try refreshing the page
- Check browser console for errors
- Try different browser

---

## Keep Going 🚀

### Next Steps (Optional)

**To Add Real Data:**
1. Follow SETUP_INSTRUCTIONS.md
2. Create Google Sheets budget tracker
3. Get API credentials
4. Update environment variables
5. Set `DEMO_MODE=false`

**To Customize:**
- Edit mock data in `lib/demo/mockData.ts`
- Change colors in `tailwind.config.ts`
- Modify dashboard layout in `app/components/Dashboard.tsx`

**To Deploy Updates:**
```bash
git push origin main
# Vercel auto-deploys on push!
```

---

## Support Resources

- **Setup Help:** See `SETUP_INSTRUCTIONS.md`
- **Technical Details:** See `ARCHITECTURE.md`
- **Full Features:** See `DEPLOYMENT.md`

---

**Your demo is ready to go! 🎉**

Deploy now using Method 1 (easiest) or follow Method 2/3 above.

**Questions?** Check the documentation files in the project.
