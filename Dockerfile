FROM node:18-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm install --force

EXPOSE 3000

CMD node app.js


