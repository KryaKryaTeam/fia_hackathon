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

COPY --from=builder /build/apps/backend/dist ./dist

CMD ["node", "dist/main.js"]