#!/bin/sh
set -e

echo "[entrypoint] applying the Prisma schema"
npx prisma db push --skip-generate

# Seed only when the database has no accounts yet, so restarting the container
# never overwrites data someone has entered.
if [ "$SEED_ON_START" = "false" ]; then
  echo "[entrypoint] SEED_ON_START=false, skipping the seed"
else
  USER_COUNT=$(node -e "
    const { PrismaClient } = require('@prisma/client');
    new PrismaClient().user.count()
      .then((count) => { console.log(count); process.exit(0); })
      .catch(() => { console.log(0); process.exit(0); });
  ")

  if [ "$USER_COUNT" = "0" ]; then
    echo "[entrypoint] empty database, seeding"
    # --transpile-only: the runtime image has no src/, so the tsconfig's
    # `include` matches nothing and a type-checking run would refuse to start.
    npx ts-node --transpile-only prisma/seed.ts
  else
    echo "[entrypoint] database already has $USER_COUNT account(s), not seeding"
  fi
fi

exec "$@"
