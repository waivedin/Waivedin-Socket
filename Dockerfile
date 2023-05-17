FROM node:18-alpine

WORKDIR /app

COPY /usr/src/app/

RUN npm install --force

EXPOSE 3000

CMD npm start


