# WIP!

# Lecstor's Stack

## Prerequisites

- Docker for ..
- [Yarn](https://yarnpkg.com/en/docs/install) >= 1.17.1

## Clone it

```
git clone git@github.com:lecstor/lecstors-stack.git
```

## Load up

this *will* take a few minutes..

```
cd lecstors-stack
yarn
docker-compose pull
```

## Create a database and add tables

```
docker exec -it postgres psql -U postgres -c "create database lecstor"
NODE_ENV=localhost yarn workspace @lecstor/gateway run db:migrate
```

`NODE_ENV=localhost` tells the knex migration that we're running locally
so the db host will be `localhost` rather than `postgres` which is what it
would be if we were running in a docker container.

We can seed the database with a user too with..
```
NODE_ENV=localhost yarn workspace @lecstor/gateway run db:seed
```
username: `lecstor` password: `password` 😅

## Up and Running

The default docker-compose config will start a development-ready stack.

```
dc up
```
(with `alias dc='docker-compose'` in .bashrc / .bash_profile / .profile)

Brings up:

- gateway; our GraphQL based backend for clients
- react-app; well.. it's a React app
- postgres & rabbitmq 

The gateway service and react app will both watch your code for changes and
update automatically.

### Run the [Cypress](https://www.cypress.io/) end to end testing framework

```
yarn workspace @lecstor/cypress open
```

### Run production builds

You can run production builds for testing by overriding the compose config.

Open `docker-compose.override.yml.example` and save it as `docker-compose.override.yml`.

Docker-compose will read this file and apply the overrides to the base config.

```
dc stop gateway react-app
dc up
```

## Run the gateway service on your local machine

```
dc stop gateway
```

### in dev mode

```
yarn workspace @lecstor/gateway start:local:dev
```

### with a production build

```
yarn workspace @lecstor/gateway build
yarn workspace @lecstor/gateway start:local:dist
```

start - dev build, localhost
build:prod - prod build, localhost
start:prod - prod build, localhost

# React UI

## Storybook
```bash
yarn workspace @lecstor/react-ui storybook
```

## Run Tests

```bash
yarn workspace @lecstor/react-ui test
```

# Run a command in all packages

[wsrun](https://github.com/hfour/wsrun)

```
yarn wsrun test
```