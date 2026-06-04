# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (none for now, but keeps the layer cache-friendly)
COPY package*.json ./
RUN npm install --omit=dev

# Copy source and run the "compile"/check step
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Run as non-root for safety
USER node

COPY --from=build --chown=node:node /app .

EXPOSE 3000
CMD ["npm", "start"]
