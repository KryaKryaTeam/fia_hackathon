FROM node:22-alpine AS builder
WORKDIR /build

COPY package*.json ./

RUN npm i

COPY ./apps/backend ./apps/backend
COPY ./packages ./packages 
COPY ./nx.json ./tsconfig.base.json ./

RUN npx nx build backend --prod

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm i --omit=dev

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /build/apps/backend/dist ./dist

RUN mkdir /usr/fia/ && chown -R nestjs:nodejs /usr/fia

VOLUME [ "/usr/fia" ]

USER nestjs

CMD ["node", "dist/main.js"]