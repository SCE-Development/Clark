FROM node:8.12.0-jessie

LABEL maintainer="Joon Chew"

COPY api/ ./api/
COPY log/ ./log/
COPY mdbi/ ./mdbi/
COPY package.json ./
COPY public/ ./public/
COPY server.js ./
COPY smci/ ./smci/
COPY test/ ./test/
COPY util/ ./util/
COPY Gruntfile.js .

RUN npm install 
