# Build context is the repository root, so the seed can pick up the cabin
# photos that live with the React app.
#   docker build -f server/Dockerfile .

FROM node:22-alpine AS builder

WORKDIR /app

COPY server/package*.json ./
RUN npm ci

COPY server/tsconfig.json server/nest-cli.json ./
COPY server/prisma ./prisma
COPY server/src ./src

RUN npx prisma generate && npx nest build


FROM node:22-alpine AS runtime

WORKDIR /app

# node_modules comes over whole rather than production-only: the entrypoint
# runs `prisma db push` and the ts-node seed on first boot, and both are dev
# dependencies.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY server/package*.json server/tsconfig.json ./

# Sample cabin photos, copied into the uploads volume by the seed.
COPY src/data/cabins /app/seed-images
COPY server/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# The database and the uploaded images are the only state; both are volumes in
# docker-compose so they survive a rebuild.
ENV DATABASE_URL="file:/data/dev.db" \
    SEED_IMAGES_DIR="/app/seed-images" \
    NODE_ENV=production \
    PORT=3000

RUN mkdir -p /data /app/uploads

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
