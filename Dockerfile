FROM node:10.15-alpine

LABEL maintainer="Gonzalo Spina <gspina1995@gmail.com>"
ENV MICROSERVICE=core
ENV TZ=America/Argentina/Buenos_Aires

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=prod

COPY . .

CMD node index.js