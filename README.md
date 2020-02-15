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

## Run react-app on your host machine in dev mode

```
dc stop react-app
yarn workspace @lecstor/react-app run dev
```

### Run react-app with a production build in docker

```
make dc-build-app-prod dc-restart-react-app-prod
```
Visit http://localhost/

### Run the [Cypress](https://www.cypress.io/) end to end testing framework

```
make cypress-open
```

# React UI

## Storybook
```bash
yarn workspace @lecstor/react-ui storybook
```

## Run Tests

```bash
yarn workspaces run test
yarn workspace @lecstor/react-ui test
```

# Run a command in all packages

[wsrun](https://github.com/hfour/wsrun)

```
make test
yarn wsrun --skip-missing -c test
```