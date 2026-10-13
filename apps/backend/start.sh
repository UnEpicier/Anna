#!/bin/sh
# Container entrypoint: apply pending database migrations, then start the API.
# `prisma migrate deploy` takes a PostgreSQL advisory lock, so several replicas
# starting at once (rollout restart) will not run the same migration twice.
# Set SKIP_MIGRATIONS=true to start the API without touching the schema.
set -eu

if [ "${SKIP_MIGRATIONS:-false}" != "true" ]; then
	echo "Applying database migrations..."
	./node_modules/.bin/prisma migrate deploy
fi

# exec so that SIGTERM/SIGINT reach node and the graceful shutdown runs
exec node dist/index.js
