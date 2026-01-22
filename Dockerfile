# Stage 1: Install dependencies
# GANTI dari node:18-alpine ke node:20-alpine
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
# GANTI dari node:18-alpine ke node:20-alpine
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner (Production Image)
# GANTI dari node:18-alpine ke node:20-alpine
FROM node:20-alpine AS runner
WORKDIR /app

# Perbaikan format ENV (menggunakan tanda =)
ENV NODE_ENV=production

# Buat user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy hasil build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Perbaikan format ENV
ENV PORT=3000

CMD ["node", "server.js"]