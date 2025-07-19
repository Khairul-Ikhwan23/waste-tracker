FROM node:18-alpine
WORKDIR /app

# 1️⃣ Copy manifests & install everything (including tsx & dev‑deps)
COPY package.json package-lock.json ./
RUN npm install

# 2️⃣ Copy your source code
COPY . .

# 3️⃣ Build the front‑end
RUN npm run build:client

# 4️⃣ Expose and launch the API (server/index.ts) with tsx
EXPOSE 3000
CMD ["npm","run","start:api"]
