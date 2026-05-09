# Quick Start Guide - Budget Dashboard

Get your budget dashboard up and running in 15 minutes!

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Credentials

**Google Sheets Service Account:**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create Service Account → Download JSON key
- Share your spreadsheet with the service account email

**Claude API Key:**
- Go to [Anthropic Console](https://console.anthropic.com)
- Create API key

### 3. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:
```
GOOGLE_SHEETS_SPREADSHEET_ID=1i4fV-iOfDpe_nS3BW5KmvyFH4g2Z2ysJKEpFZWz-YyU
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
ANTHROPIC_API_KEY=sk-...
DASHBOARD_PASSWORD=your-password
JWT_SECRET=your-random-secret
```

### 4. Run Locally
```bash
npm run dev
```

Visit `http://localhost:3000`

## Deploy to Vercel (5 Minutes)

### 1. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/budget-dashboard.git
git push -u origin main
```

### 2. Deploy
- Go to [Vercel](https://vercel.com)
- Click "New Project"
- Select your GitHub repo
- Vercel auto-detects Next.js settings
- Click "Deploy"

### 3. Set Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

**Done!** Your dashboard is live.

## Using the Dashboard

### Login
- User: `Andy` or `Aileen`
- Password: Your configured password

### Upload Receipt
1. Click "Submit Receipt"
2. Take/upload receipt photo
3. Review extracted details
4. Confirm to save

### View Analytics
- See budget summary (Income, Expenses, Net)
- View spending by category (pie chart)
- Check transaction history
- Switch between months/years

## API Endpoints

```
POST   /api/auth/login          # Login
GET    /api/sheets/data         # Get month data
POST   /api/ocr/process         # Process receipt
```

## Spreadsheet Format

Your Google Sheets must have sheets named like: `May 2024`, `April 2024`

Format (columns: A-E):
```
Date       | Amount | Category          | Subcategory    | Description
2024-05-15 | 25.50  | Variable Expenses | Groceries      | Whole Foods
2024-05-14 | 45.00  | Monthly Bills     | NIPSCO         | Utility Bill
```

## Telegram Bot (Optional)

1. Message [@BotFather](https://t.me/botfather)
2. Create bot `/newbot`
3. Copy token to `TELEGRAM_BOT_TOKEN`
4. Send bot a photo to start!

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing Google credentials" | Check .env.local has all Google vars |
| "Invalid password" | Verify DASHBOARD_PASSWORD is set correctly |
| OCR failing | Check ANTHROPIC_API_KEY is valid |
| Sheets not updating | Verify service account has editor access |

## Next Steps

- [ ] Customize categories in `lib/ocr/receipt-processor.ts`
- [ ] Add more subcategories
- [ ] Set up Telegram bot
- [ ] Customize dashboard colors
- [ ] Add budget goals/alerts

## File Structure

```
budget-dashboard/
├── app/
│   ├── api/                 # Backend endpoints
│   ├── components/          # React components
│   ├── dashboard/           # Dashboard page
│   └── page.tsx             # Login page
├── lib/
│   ├── auth/                # JWT authentication
│   ├── google/              # Google Sheets API
│   ├── ocr/                 # Receipt OCR processing
│   └── telegram/            # Telegram bot
├── .env.local               # Configuration
├── next.config.js           # Next.js config
├── package.json             # Dependencies
└── README.md                # Full documentation
```

## Key Features

✅ Receipt photo OCR with Claude Vision  
✅ Automatic Google Sheets logging  
✅ Real-time budget dashboard  
✅ Category auto-suggestion  
✅ Multi-user with password protection  
✅ Mobile-responsive design  
✅ Telegram bot integration  
✅ Smart category mapping  

## Support

See **README.md** for full documentation  
See **DEPLOYMENT.md** for detailed deployment guide

---

**You're all set!** Happy budgeting! 💰
