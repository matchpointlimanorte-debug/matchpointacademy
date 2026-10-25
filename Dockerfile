FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY .npmrc ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=temp_secret_for_docker_build_32_characters_long

RUN npm run generate:importmap
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV PAYLOAD_DB_PUSH=true

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

CMD ["sh", "-c", "npm run seed && npm run start"]
