FROM alpine
#gets the base linux image

WORKDIR /app
#all commands will run in this directory

COPY ./package.json .
#copies all the dependenices into work directory (./app) (since you set the work dir before)

RUN npm install 
#installs packages

COPY ./peripheral_api /app/peripheral_api
#copies this file to the desination

COPY ./util /app/util

COPY ./config/config.json /app/config/config.json

EXPOSE 8081

ARG DATABASE_HOST

ARG NODE_ENV

ARG MAIN_ENDPOINT_URL

CMD [ "node", "./peripheral_api/server.js" ]
