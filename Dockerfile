ARG PORT=8080
ARG DATABASE
ARG DATABASE_HOST
ARG DATABASE_USER
ARG DATABASE_PASSWORD

FROM node:17.8-slim

WORKDIR /app

COPY . .

RUN yarn install --production

RUN yarn build

EXPOSE 8080

CMD yarn migrate:latest:production && yarn start