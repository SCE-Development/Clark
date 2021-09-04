FROM node:alpine

WORKDIR /app

ENV DATABASE_HOST db

ENV NODE_ENV production

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 8080

ENV DOCKER true

ENV NODE_ENV production

CMD [ "node", "./server.js" ]