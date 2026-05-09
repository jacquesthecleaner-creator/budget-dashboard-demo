# Deployment Guide - Household Budget Dashboard

This guide walks through deploying the budget dashboard to Vercel with full functionality.

## Prerequisites

- GitHub account (for deploying via Vercel)
- Google Cloud Project with Sheets API enabled
- Anthropic API key
- Telegram Bot token (optional, for Telegram integration)

## Step 1: Google Cloud Setup

### 1.1 Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the Google Sheets API:
   - Go to APIs & Services → Library
   - Search for "Google Sheets API"
   - Click Enable

4. Create a Service Account:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → Service Account
   - Fill in details and click "Create and Continue"
   - Skip optional steps and click "Done"

### 1.2 Generate Private Key

1. In the Service Accounts list, click on your created account
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" and click "Create"
5. A JSON file will download - keep this safe!

### 1.3 Share Spreadsheet

1. Open your budget spreadsheet
2. Click "Share" button
3. Copy the service account email from the downloaded JSON key
4. Share the spreadsheet with that email (give Editor access)

## Step 2: Anthropic API Setup

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create an account/login
3. Go to API keys section
4. Create a new API key
5. Copy and save it (you won't be able to view it again)

## Step 3: GitHub Setup

1. Fork or clone this repository to your GitHub account
2. Ensure you have a GitHub personal access token for Vercel integration

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Navigate to project directory
cd budget-dashboard

# Deploy
vercel
```

Follow the prompts:
- Connect to GitHub account
- Select the repository
- Vercel will auto-detect Next.js settings

### Option B: Using Vercel Web Dashboard

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Vercel will auto-detect Next.js
6. Click "Deploy"

## Step 5: Configure Environment Variables

After deployment, set environment variables in Vercel:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:

```
GOOGLE_SHEETS_SPREADSHEET_ID
Value: 1i4fV-iOfDpe_nS3BW5KmvyFH4g2Z2ysJKEpFZWz-YyU

GOOGLE_SERVICE_ACCOUNT_EMAIL
Value: your-service-account@project.iam.gserviceaccount.com

GOOGLE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQE...
...
-----END PRIVATE KEY-----

ANTHROPIC_API_KEY
Value: sk-...

DASHBOARD_PASSWORD
Value: your-secure-password-here

JWT_SECRET
Value: your-random-jwt-secret-key-here

TELEGRAM_BOT_TOKEN (optional)
Value: your-telegram-bot-token

TELEGRAM_WEBHOOK_SECRET (optional)
Value: your-webhook-secret

NEXT_PUBLIC_API_URL
Value: https://your-vercel-domain.com
```

**Important:** For `GOOGLE_PRIVATE_KEY`, replace actual newlines with literal `\n` sequences. So:
```
-----BEGIN PRIVATE KEY-----
MIIEv
...
-----END PRIVATE KEY-----
```

Becomes:
```
-----BEGIN PRIVATE KEY-----\nMIIEv\n...\n-----END PRIVATE KEY-----
```

4. Click "Save" for each variable

## Step 6: Verify Deployment

1. Visit your Vercel domain (e.g., `https://budget-dashboard.vercel.app`)
2. Login with configured password
3. Test receipt upload
4. Verify Google Sheets updates

## Step 7: Telegram Bot Setup (Optional)

If using Telegram integration:

### 7.1 Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Follow instructions to create bot
4. Copy the bot token
5. Add to `.env.local` as `TELEGRAM_BOT_TOKEN`

### 7.2 Set Webhook (Production)

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram/webhook",
    "secret_token": "your-webhook-secret"
  }'
```

For development, the bot runs in polling mode automatically.

## Troubleshooting Deployment

### "Google credentials not found"

Verify all Google environment variables are set:
```bash
vercel env ls
```

### "Cannot read properties of undefined (reading 'values')"

This usually means the Google Sheets API call failed. Check:
1. Spreadsheet ID is correct
2. Service account has access to spreadsheet
3. Sheet name matches expected format (`Month Year`)

### "Invalid token" on login

Check that `JWT_SECRET` is set in Vercel environment variables.

### OCR not working

1. Verify `ANTHROPIC_API_KEY` is correct
2. Check API quota/limits in Anthropic console
3. Ensure Claude 3.5 Sonnet is available in your region

### Receipt uploads result in 401

Check that authentication middleware is working:
```bash
# Test auth endpoint locally
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"test","user":"andy"}'
```

## Monitoring & Logs

View logs in Vercel dashboard:
1. Go to project → Deployments
2. Click on latest deployment
3. View "Function Logs" tab

## Performance Optimization

### For Large Datasets

If dealing with many transactions, consider:

1. **Pagination**: Limit transactions per page
2. **Caching**: Add Redis cache for month data
3. **Lazy Loading**: Load charts progressively
4. **Indexing**: Add row numbers to sheets for faster queries

### Image Optimization

Set upload limits in receipt processor:
```typescript
// lib/ocr/receipt-processor.ts
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const COMPRESSED_QUALITY = 0.8;
```

## Security Best Practices

1. **Rotate Passwords Regularly**
   ```bash
   # Update DASHBOARD_PASSWORD in Vercel
   ```

2. **Monitor API Usage**
   - Check Anthropic console for usage
   - Monitor Google Sheets API quota

3. **Enable Vercel Analytics**
   - Go to Settings → Analytics
   - Track performance and errors

4. **Set Up Alerts**
   - Configure Vercel alerts for deployment failures
   - Set up log monitoring

## Custom Domain Setup

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as shown by Vercel
4. SSL certificate auto-generates

## Scaling Considerations

As the system grows:

1. **Database**: Consider moving to proper database instead of Google Sheets
2. **Image Storage**: Use object storage (S3, Google Cloud Storage)
3. **Job Queue**: For async OCR processing with many receipts
4. **CDN**: Vercel includes automatic CDN caching
5. **Rate Limiting**: Add rate limiting for API endpoints

## Rollback Plan

If something goes wrong:

```bash
# View deployment history
vercel deployments

# Rollback to previous version
vercel rollback

# Or redeploy from GitHub
# Push to main branch → Vercel auto-deploys
```

## Maintenance

### Monthly Tasks
- Review API usage and costs
- Backup spreadsheet data
- Check error logs
- Update dependencies: `npm update`

### Quarterly Tasks
- Security audit
- Performance review
- Feature updates
- Cost optimization

## Support & Help

- Anthropic API Issues: https://support.anthropic.com
- Google Cloud Help: https://cloud.google.com/support
- Vercel Documentation: https://vercel.com/docs
- Telegram Bot API: https://core.telegram.org/bots/api

---

**Deployment successful!** Your budget dashboard is now live and ready to use.
