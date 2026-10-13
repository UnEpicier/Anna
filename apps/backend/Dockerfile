# Build context is the repository root:
#   docker build -f apps/backend/Dockerfile -t anna-api .

# Base stage with pnpm (version pinned by the root package.json "packageManager")
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Build stage - install the backend workspace graph and build it
FROM base AS build

# Manifests first so the dependency layer is cached until a dependency changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backoffice/package.json apps/backoffice/package.json
COPY packages/app-types/package.json packages/app-types/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts --filter backend...

COPY packages/app-types packages/app-types
COPY packages/typescript-config packages/typescript-config
COPY apps/backend apps/backend

# app-types must be compiled before the backend type-checks against it.
# prisma.config.ts requires DATABASE_URL to be defined, generate never connects to it.
RUN pnpm --filter @repo/app-types build \
    && DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder \
       pnpm --filter backend prisma:generate \
    && pnpm --filter backend build \
    && pnpm --filter backend deploy --prod --legacy /prod/backend

# Final stage - production dependencies and build output only, no secrets baked in
FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /prod/backend/node_modules ./node_modules
COPY --from=build --chown=node:node /prod/backend/package.json ./package.json
COPY --from=build --chown=node:node /app/apps/backend/dist ./dist

# Use the node user from the image
USER node

# Configuration (DATABASE_URL, REDIS_*, JWT_SECRET, ...) is injected at runtime
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD node -e "fetch('http://localhost:'+(process.env.PORT||8080)+'/health-check').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Start the server
CMD ["node", "dist/index.js"]
