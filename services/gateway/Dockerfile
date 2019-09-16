#
# Builds a production image by default
# set `target: development` for a build with src watch/auto restart
# 
FROM node:12.10.0-alpine AS base

WORKDIR /usr/src

RUN mkdir services
COPY services/gateway services/gateway
COPY .yarn .yarn
COPY ["package.json", "yarn.lock", ".yarnrc", ".yarnrc.yml", "./"]
# COPY .pnp.js ./ # don't need to copy as we run install

# install not required but it removes unused npm modules from the cache
# yarn cache clean # doesn't seem to work in this instance..?
RUN yarn

#---
# keep development image slim
# The base stage deleted unused node modules from the cache but that doesn't
# shed the weight of them.
FROM node:12.10.0-alpine AS development

ENV NODE_CONFIG_ENV development
ENV NODE_ENV development

WORKDIR /usr/src

COPY --from=base /usr/src .

CMD ["yarn", "run", "gateway:dev"]

#---
FROM development AS prodbuild

WORKDIR /usr/src

RUN yarn gateway:build

# remove devDeps from package.json
RUN yarn remove -A $(echo 'console.log(Object.keys(require("./services/gateway/package.json").devDependencies).join(" "))' | node -)

#---
FROM node:12.10.0-alpine AS production

ENV NODE_CONFIG_ENV development
ENV NODE_ENV development

WORKDIR /usr/src

COPY ["yarn.lock",".yarnrc",".yarnrc.yml","./"]
COPY --from=prodbuild /usr/src/services/gateway/package.json .
COPY --from=prodbuild /usr/src/services/gateway/config config
COPY --from=prodbuild /usr/src/services/gateway/dist dist
COPY --from=prodbuild /usr/src/.yarn .yarn
RUN yarn install

CMD ["yarn", "gateway:start"]

