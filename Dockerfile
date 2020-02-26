FROM node:12.10.0-alpine AS base

# install node modules

WORKDIR /usr/src

RUN apk --no-cache add --virtual builds-deps build-base python

COPY apps/react-app/package.json apps/react-app/
COPY modules/config/package.json modules/config/
COPY modules/react-ui/package.json modules/react-ui/
COPY services/gateway/package.json services/gateway/
COPY docker/wait-for.sh .

COPY .yarn .yarn
COPY ["package.json", "tsconfig.json", "yarn.lock", ".yarnrc", "./"]

RUN yarn  --offline --frozen-lockfile --production

CMD ["true"]
