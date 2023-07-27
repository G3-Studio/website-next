FROM node:18-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


FROM node:18-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

#RUN npx prisma migrate deploy
RUN npx prisma generate
RUN pnpm run build

FROM node:18-alpine AS deploy
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

RUN chmod -R 755 /app

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]