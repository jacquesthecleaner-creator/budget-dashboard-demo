# Household Budget Dashboard

A comprehensive budget tracking system with receipt OCR, Google Sheets integration, Telegram bot support, and a real-time web dashboard.

## Features

### 🖥️ Web Dashboard
- **Real-time budget visualization** for April & May (configurable months)
- **Category breakdowns** with pie and bar charts
- **Spending trends** and analysis
- **Transaction history** with filtering
- **Mobile-friendly** responsive design
- **Password-protected login** for security
- **Multi-user support** (Andy & Aileen)

### 📸 Receipt OCR
- **Automatic receipt processing** via photo upload
- **AI-powered extraction** using Claude Vision API
- **Smart category suggestion** based on merchant name
- **Manual category override** for accuracy
- Supports JPG, PNG, GIF, WebP formats

### 📱 Telegram Integration
- Send receipt photos directly via Telegram
- Automatic extraction and confirmation workflow
- Real-time transaction logging
- Category management commands

### 📊 Google Sheets Integration
- **Read/write access** to your budget spreadsheet
- **Automatic transaction logging** to appropriate month sheets
- **Real-time data sync** between app and sheets
- Transaction format: Date | Amount | Category | Subcategory | Description

## Architecture

```
┌─────────────────────────────────────┐
│   Frontend (Next.js React)          │
│  - Dashboard with charts            │
│  - Receipt uploader                 │
│  - Authentication                   │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│   Backend API Routes                │
│  - OCR processing                   │
│  - Google Sheets sync               │
│  - Authentication/JWT               │
└────────────┬────────────────────────┘
             │
     ┌───────┴────────┬──────────────┐
     │                │              │
┌────▼────┐    ┌──────▼────┐   ┌────▼────────┐
│ Claude  │    │ Google    │   │ Telegram    │
│ Vision  │    │ Sheets    │   │ Bot API     │
└─────────┘    └───────────┘   └─────────────┘
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **OCR**: Claude 3.5 Sonnet Vision API
- **Spreadsheets**: Google Sheets API
- **Telegram**: node-telegram-bot-api
- **Charts**: Recharts
- **Auth**: JWT with secure cookies
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud Project with Sheets API enabled
- Anthropic API key (for Claude Vision)
- Telegram Bot token (optional)

### 1. Clone and Setup

```bash
cd budget-dashboard
npm install
```

### 2. Environment Variables

Create `.env.local` based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1i4fV-iOfDpe_nS3BW5KmvyFH4g2Z2ysJKEpFZWz-YyU
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# Claude API
ANTHROPIC_API_KEY=sk-...

# Dashboard
DASHBOARD_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/telegram/webhook
TELEGRAM_WEBHOOK_SECRET=your-webhook-secret

# Environment
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Google Cloud Setup

1. Create a service account in Google Cloud Console
2. Generate a private key (JSON format)
3. Share the budget spreadsheet with the service account email
4. Add the credentials to `.env.local`

### 4. Local Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Deployment to Vercel

```bash
npm run build
vercel
```

Add environment variables in Vercel dashboard.

## Usage

### Web Dashboard
1. Visit `https://your-domain.com`
2. Login with:
   - User: Andy or Aileen
   - Password: Your configured password
3. View budget analysis and transaction history
4. Upload receipts using the uploader

### Receipt Upload
1. Click "Submit Receipt" section
2. Take/upload a clear photo of receipt
3. Review extracted data
4. Confirm to save to Google Sheets

### Telegram Bot
1. Start conversation with your Telegram bot
2. Send `/start` to initialize
3. Send receipt photos
4. Confirm extraction results
5. Transaction auto-saves to Google Sheets

## Transaction Format

Google Sheets sheets must follow this structure:

| Date | Amount | Category | Subcategory | Description |
|------|--------|----------|-------------|-------------|
| 2024-05-15 | 25.50 | Variable Expenses | Groceries | Whole Foods |
| 2024-05-14 | 45.00 | Monthly Bills | NIPSCO | Utility Bill |

### Categories
- **Variable Expenses**: Groceries, Fuel, Household, Pet food, Diapers, Entertainment, Eating Out, Office Expense, Shopping, Medical Bills
- **Monthly Bills**: EzPass, Water Softener, Vehicle Maintenance, Internet, NIPSCO, Health Insurance, YMCA, Life Insurance, Car Insurance, Telephone, Netflix, Disney/Hulu, Pandora
- **Income**: Salary, Bonuses, etc.
- **Savings**: Transfers to savings accounts
- **Debt**: Loan payments, credit card payments

## Project Structure

```
budget-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/login/          # Authentication endpoint
│   │   ├── ocr/process/         # Receipt processing
│   │   ├── sheets/data/         # Google Sheets integration
│   │   └── telegram/webhook/    # Telegram webhook (optional)
│   ├── components/
│   │   ├── LoginForm.tsx        # Login page
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   └── ReceiptUploader.tsx  # Receipt upload component
│   ├── dashboard/               # Dashboard page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Login page
├── lib/
│   ├── auth/
│   │   └── jwt.ts               # JWT utilities
│   ├── google/
│   │   └── sheets.ts            # Google Sheets API wrapper
│   ├── ocr/
│   │   └── receipt-processor.ts # Claude Vision OCR
│   └── telegram/
│       └── bot-handler.ts       # Telegram bot logic
├── public/                      # Static assets
├── .env.local.example           # Environment template
├── next.config.js               # Next.js config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with password
  - Body: `{ password: string, user: 'andy' | 'aileen' }`
  - Returns: JWT token + sets httpOnly cookie

### Budget Data
- `GET /api/sheets/data?month=5&year=2024` - Fetch month data
  - Returns: `{ month, year, transactions[], summary }`

### Receipt Processing
- `POST /api/ocr/process` - Process receipt image
  - Body: FormData with image file
  - Returns: Extracted transaction data

## Features Roadmap

- [ ] Mobile app (React Native)
- [ ] Budget goals and alerts
- [ ] Recurring transaction templates
- [ ] Multi-currency support
- [ ] PDF report generation
- [ ] Investment tracking
- [ ] Tax category mapping
- [ ] Bulk import from banks
- [ ] Advanced analytics

## Troubleshooting

### "Missing Google credentials"
- Ensure `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` are set in `.env.local`
- Verify the service account has access to the spreadsheet

### OCR not working
- Check that `ANTHROPIC_API_KEY` is valid
- Ensure receipt photo is clear and readable
- Verify Claude 3.5 Sonnet is available in your region

### Google Sheets not updating
- Verify service account email is invited to the spreadsheet
- Check that sheet names match `MonthName Year` format (e.g., "May 2024")
- Ensure columns are in correct order: Date | Amount | Category | Subcategory | Description

### Telegram bot not responding
- Verify `TELEGRAM_BOT_TOKEN` is correct
- For local development, use polling mode (enabled by default)
- For production, set up webhook with `TELEGRAM_WEBHOOK_URL` and `TELEGRAM_WEBHOOK_SECRET`

## Security Considerations

1. **Password**: Use a strong, unique dashboard password
2. **JWT Secret**: Generate a secure random string for `JWT_SECRET`
3. **Google Credentials**: Never commit `.env.local` to version control
4. **HTTPS**: Always use HTTPS in production (Vercel auto-enables)
5. **Token Expiry**: JWT tokens expire after 30 days
6. **Rate Limiting**: Consider adding rate limiting for OCR API calls

## Performance Tips

1. **Image Optimization**: Compress receipt photos before upload
2. **Caching**: Dashboard data is fetched fresh - consider adding Redis cache for large datasets
3. **Sheet Queries**: Limit month range queries to 2-3 months at a time
4. **OCR Batching**: Process multiple receipts sequentially to manage API quotas

## Contributing

Feel free to fork, modify, and improve this system!

## License

MIT

## Support

For issues, questions, or feature requests, reach out to Andy or Aileen.

---

**Built with ❤️ for household budget tracking**
# OAuth2 configured
