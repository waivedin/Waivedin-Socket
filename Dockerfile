FROM node:18-alpine

WORKDIR /app

COPY /app

RUN npm install --force

COPY /app

EXPOSE 3000

CMD npm start


