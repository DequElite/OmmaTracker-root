FROM node:20-alpine

WORKDIR /back-end/services/auth_service
COPY package.json package-lock.json ./
RUN npm install
RUN npm install typescript --save-dev

COPY . .
RUN npx tsc

EXPOSE 5001
CMD ["npm", "start"]