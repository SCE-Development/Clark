FROM node:8.10.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY . /app/

COPY ./config/config.js /app/config/config.js

EXPOSE 8080

ENV DOCKER true

ENV NODE_ENV production

CMD [ "npm", "start" ]
