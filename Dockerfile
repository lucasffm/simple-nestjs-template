FROM node:lts-alpine

WORKDIR /home/node/nestapi

USER root

RUN mkdir -p /node_modules && chown -R node:node /home/node/nestapi

COPY package.json yarn.* ./

RUN npm install pm2 -g

RUN apk --no-cache add --virtual builds-deps build-base python && yarn

USER node

RUN sudo chown -R $USER:$(id -gn $USER) /client/*

COPY --chown=node:node . .

RUN yarn build