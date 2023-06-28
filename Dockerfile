FROM node:18-alpine

WORKDIR /app

RUN apk --update --no-cache add curl

COPY . /app

RUN npm install --force

EXPOSE 3000

CMD node app.js


