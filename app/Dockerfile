# Dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]