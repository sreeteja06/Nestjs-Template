FROM node:16-alpine As local
WORKDIR /usr/src/app

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

RUN npm i -g cross-env nest
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .