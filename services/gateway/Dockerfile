#
# Builds a production image by default
# set `target: development` for a build with src watch/auto restart
# 
FROM node:12.10.0-alpine AS base

WORKDIR /usr/src

RUN apk --no-cache add --virtual builds-deps build-base python

COPY modules/config modules/config
COPY services/gateway services/gateway
COPY .yarn .yarn
COPY ["package.json", "yarn.lock", ".yarnrc", "./"]

RUN yarn  --offline --frozen-lockfile --production

#---
FROM node:12.10.0-alpine AS development

ENV NODE_ENV development

WORKDIR /usr/src

COPY --from=base /usr/src .

CMD ["yarn", "workspace", "@lecstor/gateway", "start:docker:dev"]

#---
FROM development AS prodbuild

ENV NODE_ENV production

WORKDIR /usr/src

RUN yarn workspace @lecstor/gateway build
RUN yarn workspace @lecstor/config build
RUN yarn workspace @lecstor/gateway remove typescript ts-node ts-node-dev --frozen-lockfile --production 

#---
FROM node:12.10.0-alpine AS production

ENV NODE_ENV production

WORKDIR /usr/src

COPY ["yarn.lock",".yarnrc","./"]
COPY --from=prodbuild /usr/src/services/gateway/package.json .
COPY --from=prodbuild /usr/src/services/gateway/dist dist

# I'd prefer to have the config module installed for realz but I'm having trouble orchestrating that..
COPY --from=prodbuild /usr/src/modules/config/package.json modules/config/package.json
COPY --from=prodbuild /usr/src/modules/config/dist modules/config/dist

COPY --from=prodbuild /usr/src/node_modules node_modules

CMD ["yarn", "start:docker:dist"]
