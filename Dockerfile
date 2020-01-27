FROM node:lts-alpine

WORKDIR /home/node/nestapi

USER root

RUN mkdir -p /node_modules && chown -R node:node /home/node/nestapi

RUN apk --no-cache add --virtual builds-deps build-base python && yarn

COPY package.json yarn.* ./

USER node

COPY --chown=node:node . .

EXPOSE 3000