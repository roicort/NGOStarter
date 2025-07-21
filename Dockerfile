# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.js file.

FROM node:lts-alpine3.22 AS base

ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL

ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NEXT_OUTPUT_STANDALONE=true

# Install corepack if not present and prepare pnpm/yarn
RUN rm -rf /root/.cache/corepack && corepack enable && \
    corepack prepare pnpm@latest --activate && \
    corepack prepare yarn@stable --activate

################################################################################################

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
    
# Install bun
RUN apk add --no-cache curl bash
RUN curl -fsSL https://bun.com/install | bash && mv /root/.bun/bin/bun /usr/local/bin/bun

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* bun.lock* ./
RUN \
  if [ -f bun.lock ]; then bun install; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

################################################################################################

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f bun.lock ]; then bun run build:docker; \
  elif [ -f yarn.lock ]; then yarn run build:docker; \
  elif [ -f package-lock.json ]; then npm run build:docker; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build:docker; \
  else echo "Lockfile not found." && exit 1; \
  fi

################################################################################################

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Entrypoint script
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod 755 ./entrypoint.sh

COPY --from=deps /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/redirects.js ./redirects.js
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/src ./src

RUN mkdir -p /app/src/migrations && chown -R nextjs:nodejs /app/src/migrations

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]