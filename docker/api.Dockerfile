FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Salin konfigurasi workspace dan package.json tiap paket yang dibutuhkan
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install dependensi sesuai lockfile
RUN pnpm install --frozen-lockfile

# Salin kode sumber shared, api, dan skema prisma
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Generate Prisma Client (jika memakai Prisma di apps/api)
RUN pnpm --filter api exec prisma generate

# Build shared package dulu (jika punya script build), lalu build api
RUN pnpm --filter ./packages/shared... build || true
RUN pnpm --filter api build

# --- Stage Production ---
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api
EXPOSE 5000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm exec prisma db seed && node dist/src/main.js"]