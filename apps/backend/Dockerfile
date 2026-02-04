# Base stage with pnpm setup
FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Build stage - install all dependencies and build
FROM base AS build

COPY package.json pnpm-lock.yaml ./
# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm run prisma:generate
RUN pnpm run build

# Final stage - combine production dependencies and build output
FROM node:lts-alpine AS runner
WORKDIR /app

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/.env ./.env

# Use the node user from the image
USER node

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]