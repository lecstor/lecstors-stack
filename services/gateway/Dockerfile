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

RUN npm rebuild bcrypt --build-from-source

#---
FROM node:12.10.0-alpine AS development

ENV NODE_ENV development

WORKDIR /usr/src

COPY --from=base /usr/src .

COPY docker/wait-for.sh .
COPY services/gateway/docker-entrypoint.sh .

ENTRYPOINT ["./wait-for.sh", "postgres:5432", "--", "./docker-entrypoint.sh"]

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

COPY --from=prodbuild /usr/src/package.json .

# gateway packge for the scripts
COPY --from=prodbuild /usr/src/services/gateway/package.json services/gateway/package.json

# unpack dist into gateway dir so knexfile & db can be found for migration
COPY --from=prodbuild /usr/src/services/gateway/dist services/gateway

COPY --from=prodbuild /usr/src/modules/config/package.json modules/config/package.json
COPY --from=prodbuild /usr/src/modules/config/dist modules/config/dist

COPY --from=prodbuild /usr/src/node_modules node_modules

COPY docker/wait-for.sh .
COPY services/gateway/docker-entrypoint.sh .

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["yarn", "workspace", "@lecstor/gateway", "run", "start:docker:prod"]
