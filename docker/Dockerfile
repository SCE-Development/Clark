# Build steps for production frontend
FROM node:14.10.0-alpine as builder

WORKDIR /frontend

ARG NODE_ENV

COPY ./package.json /frontend/package.json
COPY ./package-lock.json /frontend/package-lock.json

# We don't pass the environment variables as an argument
# and instead define them inline here. We do this as multi-stage
# builds and environment variables from docker-compose.yml weren't working.
ENV REACT_APP_GENERAL_API_URL https://sce.sjsu.edu/api

ENV REACT_APP_PERIPHERAL_API_URL https://sce.sjsu.edu/peripheralapi

ENV REACT_APP_MAILER_API_URL https://sce.sjsu.edu/cloudapi

RUN npm install --production

COPY public ./public
COPY util ./util
COPY src ./src

RUN npm run build --production

# stage 2
FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /frontend/build /usr/share/nginx/html

EXPOSE 3000

EXPOSE 18000

CMD ["nginx", "-g", "daemon off;"]
