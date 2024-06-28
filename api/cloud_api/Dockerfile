
FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY ./cloud_api /app/cloud_api

COPY ./util /app/util

COPY ./config /app/config/

EXPOSE 8082

ARG GENERAL_API_URL

ARG DATABASE_HOST

ARG NODE_ENV

ARG VERIFICATION_BASE_URL

CMD [ "node", "./cloud_api/server.js" ]
