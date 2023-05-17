FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json  /usr/src/app/

RUN npm install --force

ENV NODE_ENV production

COPY . /usr/src/app/

CMD [ "node", "dist/main.js" ]
