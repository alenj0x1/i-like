FROM node:20.17.0-alpine3.20

EXPOSE 3001

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

CMD yarn build && node .
