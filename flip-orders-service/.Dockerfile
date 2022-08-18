FROM node:16.17.0-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN ls /app
RUN cat package.json

RUN npm i

ADD . .

FROM node:16.17.0-alpine AS dev

WORKDIR /app

COPY --from=base /app /app

CMD ["npm", "run", "start:dev"]