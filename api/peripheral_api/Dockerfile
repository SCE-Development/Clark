FROM node:8.10.0-alpine 
#gets the base linux image

WORKDIR /app
#all commands will run in this directory

ENV DATABASE_HOST db
#database env variable

ENV NODE_ENV production

COPY ./package.json .
#copies all the dependenices into work directory (./app) (since you set the work dir before)

RUN npm install 
#installs packages

COPY ./peripheral_api /app/peripheral_api
#copies this file to the desination

COPY ./util /app/util

COPY ./config/config.json /app/config/config.json

EXPOSE 8081

ENV DOCKER true

ENV NODE_ENV production

CMD [ "node", "./peripheral_api/server.js" ]
