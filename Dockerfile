FROM node:21-alpine

WORKDIR /app

COPY . .

ARG PORT=8080
ARG DATABASE
ARG DATABASE_HOST
ARG DATABASE_USER
ARG DATABASE_PASSWORD

ENV PORT=$PORT DATABASE=$DATABASE DATABASE_HOST=$DATABASE_HOST DATABASE_USER=$DATABASE_USER DATABASE_PASSWORD=$DATABASE_PASSWORD

RUN yarn install --frozen-lockfile --production

RUN yarn build

EXPOSE 8080

CMD yarn migrate:latest:production && yarn start
