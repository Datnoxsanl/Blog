FROM node:20-alpine

WORKDIR /usr/src/app

# Cài dependencies trước để tận dụng cache build
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
