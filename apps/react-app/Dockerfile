#
# requires the base image
#
# Builds a production image by default
# set `target: development` for a build with src watch/auto restart
# 
#---
FROM node:current-alpine AS development

ENV NODE_ENV development

WORKDIR /usr/src

COPY --from=base /usr/src/.yarn/releases .yarn/releases
COPY --from=base /usr/src/node_modules ./node_modules
COPY --from=base ["/usr/src/package.json", "/usr/src/yarn.lock", "/usr/src/.yarnrc", "./"]
COPY --from=base /usr/src/wait-for.sh .

COPY  apps/react-app apps/react-app
COPY  modules/config modules/config
COPY  modules/react-ui modules/react-ui

ENTRYPOINT ["./wait-for.sh", "gateway:3000", "--"]

CMD ["yarn", "workspace", "@lecstor/react-app", "run", "dev-docker"]

#---
FROM base AS prodbuild

WORKDIR /usr/src

COPY apps/react-app apps/react-app
COPY modules/config modules/config
COPY modules/react-ui modules/react-ui

RUN yarn workspace @lecstor/react-app run build

#---
FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY apps/react-app/nginx.conf /etc/nginx

COPY --from=prodbuild /usr/src/apps/react-app/dist /usr/src

COPY --from=prodbuild /usr/src/wait-for.sh .

ENTRYPOINT ["./wait-for.sh", "gateway:3000", "--"]

CMD ["nginx", "-g", "daemon off;"]
