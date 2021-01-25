
FROM node:8.10.0-alpine

WORKDIR /app

ENV DATABASE_HOST db

ENV NODE_ENV production

COPY package.json ./

RUN npm install --production

COPY ./cloud_api /app/cloud_api

COPY ./util /app/util

COPY ./config/config.json /app/config/config.json

EXPOSE 8082

ENV DOCKER true

ENV NODE_ENV production

CMD [ "node", "./cloud_api/server.js" ]
