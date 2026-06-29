# PlayMCP clones the repo and builds this image with Kaniko.
FROM node:20-alpine

WORKDIR /app

# Install dependencies first to leverage layer caching.
COPY package*.json ./
RUN npm install --omit=dev

# Copy the application source.
COPY . .

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]
