FROM node:alpine

WORKDIR /app

ENV DATABASE_HOST db

ENV NODE_ENV production

COPY package.json ./

RUN npm install --production

COPY ./main_endpoints /app/main_endpoints

COPY ./util /app/util

COPY ./config/config.json /app/config/config.json

EXPOSE 8080

ENV DOCKER true

ENV NODE_ENV production

CMD [ "node", "./main_endpoints/server.js" ]