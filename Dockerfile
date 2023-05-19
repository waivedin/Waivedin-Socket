FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN npm install --force

EXPOSE 3000

CMD node app.js


