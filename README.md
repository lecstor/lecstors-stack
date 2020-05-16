![Some tests](https://github.com/lecstor/lecstors-stack/workflows/Build/badge.svg)

# WIP!

# Lecstor's Stack

## Prerequisites

- Docker for ..
- [Yarn](https://yarnpkg.com/en/docs/install) >= 1.17.1

## Clone it

```
git clone git@github.com:lecstor/lecstors-stack.git
```

## Setup

this *will* take a few minutes the first time.

Change to the repo directory and start the CLI app.

```
cd lecstors-stack
yarn lecs
```

Start the stack in docker-for-mac and list the running containers.

```
lecs> dc up react-app
lecs> dc ps
```
Visit http://localhost:4321

Brings up:

- gateway; our GraphQL based backend for clients
- react-app; well.. it's a React app
- postgres & rabbitmq 

The gateway service and react app will both watch your code for changes and
update automatically.

## Options

### Run react-app on your host machine in dev mode

```
lecs> dc stop react-app
lecs> react-app start
```
Visit http://localhost:4321

This will tail the react-app logs, use ctrl-c to exit.

### Run react-app with a production build in docker

```
lecs> react-app start -p
```
Visit http://localhost:4322/

## Kubernetes

Deploy the stack to Kubernetes in Docker Desktop

### Update Kubernetes config from docker-compose config

```
yarn lecs kubernetes generate
```

### Create namespace in Kubernetes

```
yarn lecs kubernetes create namespace my-namespace
```

### Deploy to Kubernetes

```
yarn lecs kubernetes apply
```

### Run the [Cypress](https://www.cypress.io/) end to end testing framework

#### In the UI:

```
yarn lecs cypress open
```

#### or in the console:

```
yarn lecs cypress run
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
