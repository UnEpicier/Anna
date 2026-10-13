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

# Install scripts are skipped above; the Prisma CLI only needs its own engines
# downloaded, so that migrations can run offline when the container starts.
WORKDIR /prod/backend
RUN node "$(find node_modules/.pnpm -path '*/@prisma/engines/scripts/postinstall.js' | head -n 1)"

# Drop what a PostgreSQL-only runtime never loads: the query compilers/engines
# generated for the other databases Prisma supports.
RUN find node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/runtime \
      -type f \( -name '*.sqlite.*' -o -name '*.mysql.*' -o -name '*.sqlserver.*' -o -name '*.cockroachdb.*' \) -delete

# Final stage - production dependencies and build output only, no secrets baked in
FROM node:24-alpine AS runner
ENV NODE_ENV=production \
    PRISMA_HIDE_UPDATE_MESSAGE=1 \
    CHECKPOINT_DISABLE=1
WORKDIR /app

# Package managers are not needed at runtime
RUN rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx \
           /usr/local/bin/corepack /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

COPY --from=build --chown=node:node /prod/backend/node_modules ./node_modules
COPY --from=build --chown=node:node /prod/backend/package.json ./package.json
COPY --from=build --chown=node:node /app/apps/backend/dist ./dist
COPY --from=build --chown=node:node /app/apps/backend/prisma ./prisma
COPY --from=build --chown=node:node /app/apps/backend/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node --chmod=755 apps/backend/start.sh ./start.sh

# Use the node user from the image
USER node

# Configuration (DATABASE_URL, REDIS_*, JWT_SECRET, ...) is injected at runtime
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://localhost:'+(process.env.PORT||8080)+'/health-check').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Applies pending migrations, then starts the server
CMD ["./start.sh"]
