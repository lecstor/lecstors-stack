#
# Builds a production image by default
# set `target: development` for a build with src watch/auto restart
# 
FROM node:current-alpine AS base

WORKDIR /usr/src

COPY apps/react-app/package.json apps/react-app/package.json
COPY modules/config/package.json modules/config/package.json
COPY modules/react-ui/package.json modules/react-ui/package.json

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

CMD ["yarn", "workspace", "@lecstor/react-app", "run", "dev-docker"]

#---
FROM base AS prodbuild

WORKDIR /usr/src

COPY apps/react-app apps/react-app
COPY modules/config modules/config
COPY modules/react-ui modules/react-ui

COPY ["package.json", "./"]

RUN yarn workspace @lecstor/react-app run build

#---
FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY apps/react-app/nginx.conf /etc/nginx

COPY --from=prodbuild /usr/src/apps/react-app/dist /usr/src

COPY docker/wait-for.sh .

ENTRYPOINT ["./wait-for.sh", "gateway:3000", "--"]

CMD ["nginx", "-g", "daemon off;"]
