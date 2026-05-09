# Architecture Documentation

## System Overview

The Budget Dashboard is a full-stack application that processes receipt images through AI-powered OCR and syncs transaction data with Google Sheets in real-time.

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│  (Next.js React - Login, Dashboard, Receipt Upload) │
└────────────┬────────────────────────────────────────┘
             │ HTTPS
┌────────────▼────────────────────────────────────────┐
│             Next.js API Routes                       │
│  (/api/auth, /api/ocr, /api/sheets, /api/telegram)  │
└────────────┬────────────────────────────────────────┘
             │
    ┌────────┴─────────┬──────────────┐
    │                  │              │
┌───▼────┐      ┌──────▼────┐   ┌────▼──────────┐
│ Claude │      │  Google   │   │   Telegram    │
│ Vision │      │  Sheets   │   │   Bot API     │
│  API   │      │   API     │   │               │
└────────┘      └───────────┘   └────────────────┘
```

## Components

### 1. Frontend Layer (React/Next.js)

**Pages:**
- `app/page.tsx` - Login page
- `app/dashboard/page.tsx` - Main dashboard with navbar

**Components:**
- `LoginForm.tsx` - Password-based authentication
- `Dashboard.tsx` - Budget visualization with charts
- `ReceiptUploader.tsx` - Receipt photo upload & preview

**Features:**
- Client-side authentication with JWT in httpOnly cookies
- Responsive TailwindCSS design
- Recharts for data visualization
- Form validation and error handling

### 2. Backend API Layer (Next.js Routes)

#### Authentication (`/api/auth`)
```
POST /api/auth/login
├─ Accepts: { password, user: 'andy' | 'aileen' }
├─ Validates password against DASHBOARD_PASSWORD env var
├─ Returns: JWT token
└─ Sets: httpOnly cookie for subsequent requests
```

**Flow:**
1. User submits password + username
2. Backend validates against `DASHBOARD_PASSWORD`
3. Creates JWT token with user info
4. Sets secure httpOnly cookie (30 days expiry)
5. Frontend stores token, redirects to dashboard

#### OCR Processing (`/api/ocr`)
```
POST /api/ocr/process
├─ Accepts: FormData with image file
├─ Verifies: JWT token from cookies
├─ Processes:
│  ├─ Convert image to buffer
│  ├─ Send to Claude Vision API
│  ├─ Extract: date, amount, merchant
│  ├─ Suggest: category & subcategory
│  └─ Validate extracted data
├─ Saves: Transaction to Google Sheets
└─ Returns: Extracted transaction details
```

**OCR Processing Flow:**
1. Receive receipt image (JPG/PNG/GIF/WebP)
2. Convert to base64
3. Send to Claude 3.5 Sonnet with vision instructions
4. Parse JSON response
5. Map merchant name to category using fuzzy matching
6. Append transaction to appropriate month sheet
7. Return confirmation to user

#### Google Sheets Integration (`/api/sheets`)
```
GET /api/sheets/data?month=5&year=2024
├─ Accepts: month (1-12), year
├─ Fetches:
│  ├─ Sheet name: "May 2024"
│  ├─ Range: A:E (Date, Amount, Category, Subcategory, Description)
│  └─ Parses all rows
├─ Calculates:
│  ├─ Total income
│  ├─ Total expenses
│  └─ Breakdown by category
└─ Returns: Structured month data with summary
```

**Sheets Data Flow:**
1. Determine sheet name from month/year (e.g., "May 2024")
2. Use Google Sheets API to fetch range A:E
3. Parse rows into transaction objects
4. Calculate totals and category breakdowns
5. Return formatted data to frontend

#### Telegram Integration (`/api/telegram`)
```
POST /api/telegram/webhook
├─ Validates: Telegram webhook secret
├─ Receives: Message with photo
├─ Processes:
│  ├─ Download photo from Telegram servers
│  ├─ Run OCR processing
│  ├─ Send extracted data back to user
│  └─ Wait for /confirm or /cancel
└─ On confirm: Save to Google Sheets
```

### 3. Service Layer

#### `lib/google/sheets.ts`
- Google Sheets API client initialization
- Service account authentication via JWT
- Functions:
  - `getSheetData()` - Fetch raw sheet data
  - `appendTransaction()` - Add new transaction
  - `getMonthData()` - Parse month with calculations
  - `getAllMonthData()` - Fetch all months in year

**Authentication:**
```
JWT (Service Account)
├─ Email: from GOOGLE_SERVICE_ACCOUNT_EMAIL
├─ Private Key: from GOOGLE_PRIVATE_KEY env
└─ Scope: https://www.googleapis.com/auth/spreadsheets
```

#### `lib/ocr/receipt-processor.ts`
- Claude API integration for vision
- Receipt data extraction
- Category suggestion engine
- Features:
  - `processReceiptImage()` - Main OCR function
  - `findBestCategory()` - Fuzzy merchant matching
  - Supports: JPG, PNG, GIF, WebP

**Extraction Template:**
```json
{
  "date": "YYYY-MM-DD",
  "amount": 25.50,
  "merchant": "Store Name",
  "description": "Additional details"
}
```

**Category Mapping:**
- Maintains merchant → category dictionary
- Supports exact and fuzzy matching
- Falls back to "Variable Expenses > Shopping"

#### `lib/auth/jwt.ts`
- JWT creation and verification
- Password validation
- Token payload: `{ user: 'andy' | 'aileen', iat, exp }`
- Expiry: 30 days

**Token Lifecycle:**
```
1. User logs in with password
2. Backend creates JWT signed with JWT_SECRET
3. Token set in httpOnly cookie
4. Sent with each API request automatically
5. Backend verifies signature before processing
6. Expires after 30 days
```

#### `lib/telegram/bot-handler.ts`
- Telegram bot command handling
- Photo processing orchestration
- User session management
- Features:
  - `/start` - Initialize
  - `/help` - Show commands
  - Photo upload → OCR → Confirmation
  - `/confirm` - Save transaction
  - `/cancel` - Abort

## Data Flow Examples

### Receipt Upload Flow
```
1. User selects image
   ↓
2. Frontend uploads to /api/ocr/process
   ├─ FormData with image
   └─ JWT in cookies (auto-sent)
   ↓
3. Backend receives request
   ├─ Verify JWT token
   ├─ Check file MIME type
   └─ Convert to buffer
   ↓
4. Claude Vision API processes
   ├─ Send base64 image
   ├─ Extract: date, amount, merchant
   └─ Parse JSON response
   ↓
5. Category suggestion
   ├─ Normalize merchant name
   ├─ Match against dictionary
   └─ Return suggested category
   ↓
6. Google Sheets append
   ├─ Determine month sheet
   ├─ Create transaction row
   └─ Append to range A:E
   ↓
7. Frontend confirmation
   ├─ Display extracted data
   └─ Show success message
```

### Dashboard Load Flow
```
1. User navigates to /dashboard
   ├─ Check auth token in cookies
   └─ Redirect to login if missing
   ↓
2. Frontend mounts Dashboard component
   ├─ Set default month/year
   └─ Call GET /api/sheets/data
   ↓
3. Backend fetches from Google Sheets
   ├─ Get sheet "May 2024"
   ├─ Parse all rows
   ├─ Calculate totals
   └─ Return structured data
   ↓
4. Frontend receives data
   ├─ Update state
   ├─ Render charts/tables
   └─ Stop loading spinner
   ↓
5. User interacts
   ├─ Change month/year
   ├─ Upload receipt
   └─ Data auto-refreshes
```

## Security Architecture

### Authentication & Authorization
```
┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
    ┌────▼──────────────────┐
    │ Validate Password     │
    │ (DASHBOARD_PASSWORD)  │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ Create JWT Token      │
    │ (signed with SECRET)  │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────────────┐
    │ Set httpOnly Secure Cookie    │
    │ (expires 30 days)             │
    └────┬──────────────────────────┘
         │
    ┌────▼──────────────────────────┐
    │ Protect All API Routes        │
    │ (verify JWT before processing)│
    └───────────────────────────────┘
```

### Data Protection
- **In Transit**: HTTPS (enforced by Vercel)
- **In Storage**: Google Sheets encryption
- **Credentials**: Environment variables only
- **Tokens**: httpOnly, Secure, SameSite

### API Security
- Password-protected login
- JWT verification on all protected routes
- Rate limiting ready (not yet implemented)
- Input validation on all endpoints

## Deployment Architecture

### Local Development
```
localhost:3000
  ├─ Next.js dev server (hot reload)
  ├─ API routes available at /api/*
  └─ Direct Google Sheets access
```

### Production (Vercel)
```
https://domain.vercel.app
  ├─ Vercel serverless functions
  ├─ Auto-scaled globally
  ├─ CDN caching enabled
  ├─ HTTPS auto-enforced
  └─ Environment variables from Vercel
```

## Performance Considerations

### Frontend
- **Client-side state**: React hooks (useState, useEffect)
- **API caching**: None currently (can add SWR)
- **Code splitting**: Next.js automatic
- **Image compression**: Recharts handles chart rendering

### Backend
- **Google Sheets API**: Cached when possible
- **Claude API**: No caching (each receipt is unique)
- **Database**: Google Sheets (can migrate to PostgreSQL)
- **Scaling**: Vercel serverless (auto-scales)

### Optimization Opportunities
1. Add Redis cache for month data
2. Implement SWR for client-side caching
3. Batch OCR requests during peak times
4. Use database instead of sheets for high volume
5. Add CDN for static assets (Vercel default)

## Extensibility

### Adding New Features

#### 1. New Category Type
```typescript
// lib/ocr/receipt-processor.ts
const categoryMap = {
  // Add new merchant mapping
  'my-store': { category: 'Variable Expenses', subcategory: 'Shopping' }
};
```

#### 2. New API Endpoint
```typescript
// app/api/new-feature/route.ts
export async function POST(request: NextRequest) {
  // Verify auth, process, return response
}
```

#### 3. New Dashboard Chart
```typescript
// app/components/NewChart.tsx
export default function NewChart({ data }) {
  return <ResponsiveContainer>...</ResponsiveContainer>;
}

// Then import in Dashboard.tsx
```

#### 4. New Telegram Command
```typescript
// lib/telegram/bot-handler.ts
this.bot.onText(/\/newcommand/, (msg) => {
  this.handleNewCommand(msg);
});
```

## Integration Points

### External Services
1. **Claude API** - Image processing (Anthropic)
2. **Google Sheets API** - Data storage (Google Cloud)
3. **Telegram Bot API** - Messaging (Telegram)
4. **Vercel** - Hosting & deployment

### Authentication Flows
- **Google**: Service account (server-to-server)
- **Anthropic**: API key (server-to-API)
- **Telegram**: Bot token (server-to-bot)
- **Dashboard**: Password + JWT (user-to-server)

## Error Handling

### API Errors
```
├─ 400: Bad request (missing fields)
├─ 401: Unauthorized (invalid token/password)
├─ 500: Server error (API failures, data errors)
└─ Returns: { error: "message" }
```

### User Feedback
- Login errors shown in form
- Receipt processing errors as alerts
- Sheet data errors trigger retry button
- All errors logged to console (dev) / Vercel logs (prod)

## Testing Strategy

### Unit Tests (Not yet implemented)
- JWT creation/verification
- Category matching
- Receipt parsing

### Integration Tests
- OCR end-to-end
- Sheets append and fetch
- Login flow

### Manual Testing
- Upload various receipt types
- Test all category suggestions
- Verify sheet updates
- Check dashboard accuracy

## Monitoring & Observability

### Current
- Browser console errors
- Vercel deployment logs

### Recommended
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- API usage logging
- Google Sheets audit trail

---

**This architecture is scalable, secure, and maintainable.** Future upgrades should follow these patterns.
