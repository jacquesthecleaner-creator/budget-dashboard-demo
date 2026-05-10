# Multi-stage build for Next.js application
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV DEMO_MODE true
ENV DASHBOARD_PASSWORD demo123
ENV JWT_SECRET demo-jwt-secret-change-in-production
ENV GOOGLE_SHEETS_SPREADSHEET_ID dummy
ENV GOOGLE_SERVICE_ACCOUNT_EMAIL dummy@example.com
ENV GOOGLE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE\n-----END PRIVATE KEY-----"
ENV ANTHROPIC_API_KEY dummy
ENV NODE_ENV production

RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start command
CMD ["npm", "start"]
