#
# Builds a production image by default
# set `target: development` for a build with src watch/auto restart
# 
FROM node:12.10.0-alpine AS base

WORKDIR /usr/src

RUN mkdir apps
COPY apps/react-app apps/react-app
RUN mkdir libs
COPY libs/react-ui libs/react-ui
COPY .yarn .yarn
COPY ["package.json", "tsconfig.json", "yarn.lock", ".yarnrc", ".yarnrc.yml", "./"]
# don't need to copy .pnp.js as we run install
# COPY .pnp.js ./

# install not required but it removes unused npm modules from the cache
# yarn cache clean # doesn't seem to work in this instance..?
RUN yarn

#---
# keep development image slim
# The base stage deleted unused node modules from the cache but that doesn't
# shed the weight of them.
FROM node:12.10.0-alpine AS development

# ENV NODE_CONFIG_ENV development
# ENV NODE_ENV development

WORKDIR /usr/src

COPY --from=base /usr/src .

CMD ["yarn", "run", "react:dev"]

# #---
# FROM development AS prodbuild

# WORKDIR /usr/src

# RUN yarn gateway:build

# # remove devDeps from package.json
# RUN yarn remove -A $(echo 'console.log(Object.keys(require("./apps/gateway/package.json").devDependencies).join(" "))' | node -)

# #---
# FROM node:12.10.0-alpine AS production

# ENV NODE_CONFIG_ENV development
# ENV NODE_ENV development

# WORKDIR /usr/src

# COPY ["yarn.lock",".yarnrc",".yarnrc.yml","./"]
# COPY --from=prodbuild /usr/src/apps/gateway/package.json .
# COPY --from=prodbuild /usr/src/apps/gateway/config config
# COPY --from=prodbuild /usr/src/apps/gateway/dist dist
# COPY --from=prodbuild /usr/src/.yarn .yarn
# RUN yarn install

# CMD ["yarn", "gateway:start"]

