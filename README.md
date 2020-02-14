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
make db:migrate
```

We can seed the database with a user too with..
```
make db:seed
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
make cypress-open
```

### Run react-app with a production build

```
make dc-build-app-prod
docker-compose restart react-app
```
Visit http://localhost/

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