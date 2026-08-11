FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY ../backend/prisma ./prisma/

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY ../backend/prisma ./prisma/

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/index.js"]
