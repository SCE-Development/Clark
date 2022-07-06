FROM node:alpine

WORKDIR /app

ENV DATABASE_HOST db

COPY package.json ./

RUN npm install --production

COPY ./main_endpoints /app/main_endpoints

COPY ./util /app/util

COPY ./config/config.json /app/config/config.json

EXPOSE 8080

ARG PERIPHERAL_API_URL

CMD [ "node", "./main_endpoints/server.js" ]