# Install dependencies only when needed
FROM node:20 AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci && npx prisma generate

# Rebuild the source code only when needed
FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV production

# Install Python and system dependencies for OpenCV and script execution
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    libgl1-mesa-glx \
    libglib2.0-0 \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/requirements.txt ./requirements.txt
COPY --from=builder /app/prisma ./prisma

# Install Python requirements
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy and setup start script
COPY --from=builder /app/docker-start.sh ./docker-start.sh
USER root
RUN chmod +x ./docker-start.sh
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["./docker-start.sh"]