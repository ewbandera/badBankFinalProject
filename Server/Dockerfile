FROM node:slim

LABEL maintainer="ericbandera@gmail.com"

WORKDIR /app

COPY index.js /app/index.js
COPY admin.js /app/admin.js
COPY auth-routes.json /app/auth-routes.json
COPY dal.js /app/dal.js
COPY firebaseConfig.js /app/firebaseConfig.js
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY swagger.json /app/swagger.json
COPY public/ /app/public/
COPY docker-compose.yml /app/docker-compose.yml
RUN npm install
EXPOSE 3001
ENTRYPOINT node index.js