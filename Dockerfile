FROM node:17.8-slim

WORKDIR /app

COPY . .

RUN yarn install --production

RUN yarn build

EXPOSE 8080

CMD yarn migration:latest:production && yarn start