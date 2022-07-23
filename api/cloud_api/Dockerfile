
FROM node:14.10.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY ./cloud_api /app/cloud_api

COPY ./util /app/util

COPY ./config/config.json /app/config/config.json

EXPOSE 8082

ARG GENERAL_API_URL

ARG DATABASE_HOST

ARG VERIFICATION_BASE_URL

CMD [ "node", "./cloud_api/server.js" ]
