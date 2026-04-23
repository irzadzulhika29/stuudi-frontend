# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- TAMBAHKAN INI ---
# Terima ARG dari GitHub Actions dan jadikan ENV untuk proses build Next.js
ARG NEXT_PUBLIC_BASE_API
ENV NEXT_PUBLIC_BASE_API=$NEXT_PUBLIC_BASE_API
# ---------------------

RUN npm run build

# Stage 3: Runner (Production Image)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# (Opsional) Jika Anda butuh API di server-side saat runtime, tambahkan juga di sini:
ENV NEXT_PUBLIC_BASE_API=$NEXT_PUBLIC_BASE_API

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]