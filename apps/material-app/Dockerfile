#
# Builds a production image by default
# set `target: development` for a build with src watch/auto restart
# 
FROM node:current-alpine AS base

WORKDIR /usr/src

COPY apps/material-app/package.json apps/material-app/package.json
COPY modules/config/package.json modules/config/package.json
COPY modules/privileges/package.json modules/privileges/package.json

COPY .yarn .yarn
COPY ["package.json", "tsconfig.json", "yarn.lock", ".yarnrc", "./"]

RUN yarn --offline --production

#---
FROM node:current-alpine AS development

ENV NODE_ENV development

WORKDIR /usr/src

COPY --from=base /usr/src/node_modules ./node_modules
COPY ["package.json", "./"]

COPY docker/wait-for.sh .

ENTRYPOINT ["./wait-for.sh", "gateway:3000", "--"]

CMD ["yarn", "workspace", "@lecstor/material-app", "run", "dev-docker"]

#---
FROM base AS prodbuild

WORKDIR /usr/src

COPY apps/material-app apps/material-app
COPY modules/config modules/config
COPY modules/privileges modules/privileges

COPY ["package.json", "./"]

RUN yarn workspace @lecstor/material-app run build

#---
FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY apps/material-app/nginx.conf /etc/nginx

COPY --from=prodbuild /usr/src/apps/material-app/dist /usr/src

COPY docker/wait-for.sh .

ENTRYPOINT ["./wait-for.sh", "gateway:3000", "--"]

CMD ["nginx", "-g", "daemon off;"]
