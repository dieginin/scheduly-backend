# 1. DEPENDENCIES STAGE
FROM node:lts-alpine3.23 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. BUILD STAGE
FROM node:lts-alpine3.23 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# 3. RUN STAGE
FROM node:lts-alpine3.23 AS runner

# Create app user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist

# Change ownership and switch to non-root user
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

EXPOSE 3000

CMD [ "node","dist/main" ]