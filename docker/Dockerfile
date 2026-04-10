# Build steps for production frontend
FROM node:20.10.0-alpine as builder

WORKDIR /frontend

ARG NODE_ENV

COPY ./frontend/package.json /frontend/package.json
COPY ./frontend/package-lock.json /frontend/package-lock.json

# We don't pass the environment variables as an argument
# and instead define them inline here. We do this as multi-stage
# builds and environment variables from docker-compose.yml weren't working.
ENV VITE_BASE_API_URL https://sce.sjsu.edu

RUN npm install

COPY ./frontend/public ./public

COPY ./frontend/src ./src

COPY ./frontend/tailwind.config.js ./tailwind.config.js

RUN npx tailwindcss build -i src/input.css -o public/output.css --minify

RUN npm run build --production

# stage 2
FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /frontend/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
