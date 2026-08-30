FROM node:20-slim AS base
WORKDIR /app

FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends libc6 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y --no-install-recommends libc6 openssl && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 3001 --system nextjs
RUN adduser \
    --system --uid 3001 \
    --ingroup nextjs \
    --disabled-password \
    --shell /bin/sh \
    nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER nextjs

ENV DATABASE_URL="postgresql://postgres:password@postgres:5432/taskpmp?schema=public"

EXPOSE 3000

CMD ["node", "server.js"]
