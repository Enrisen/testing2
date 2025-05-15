# Stage 1: Install dependencies
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# Use 'npm ci' for cleaner installs if package-lock.json is present
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# These files are copied from the .next/standalone directory which is created by 'output: "standalone"' in next.config.js
# If you are not using 'output: "standalone"', you'll need to adjust this section.
# For 'output: "standalone"', the server.js is the entry point.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# The PORT environment variable will be set by Cloud Run (defaulting to 8080).
# Your Next.js app needs to listen on this port.
# If using 'output: "standalone"', the server.js in .next/standalone typically handles this.
# If not, ensure your 'next start' command uses it.
ENV PORT 3000

# For 'output: "standalone"', the command is to run the server.js file.
CMD ["node", "server.js"]
# If you are NOT using 'output: "standalone"', your CMD might be:
# CMD ["npm", "run", "start"]
# And your package.json "start" script should be: "next start -p $PORT" or similar
# to respect the PORT environment variable.
