# Muti stage build rn where in one we use python
# what if we just use one buld and see if it works
# can also check package-lock to see if grpc was updated

# https://github.com/nanogiants/docker-nodejs/issues/3
# https://github.com/nodejs/docker-node/issues/282

FROM node:8.10.0-alpine as builder

WORKDIR /app

COPY package.json ./

RUN apk add --no-cache python make gcc g++ \
  && npm install --production

COPY . /app/

COPY ./config/config.js /app/config/config.js

RUN npm install -g request

RUN npm config set unsafe-perm true

RUN npm install protoc-gen-grpc -g

RUN npm rebuild --unsafe-perm --build-from-source

FROM node:8.10.0-alpine

WORKDIR /app

COPY --from=builder /app/ /app/

RUN pwd

RUN ls

EXPOSE 8080

ENV DOCKER true

ENV NODE_ENV production

CMD [ "npm", "start" ]
