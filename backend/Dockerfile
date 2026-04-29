FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --maxsockets 2
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --maxsockets 2 && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
