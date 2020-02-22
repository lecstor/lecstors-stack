![.github/workflows/main.yaml](https://github.com/lecstor/lecstors-stack/workflows/Some%20Tests/badge.svg)

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

this *will* take a few minutes..

```
cd lecstors-stack
source ./lecstors-stack.sh
yarn && lecstors-stack logup
```

Brings up:

- gateway; our GraphQL based backend for clients
- react-app; well.. it's a React app
- postgres & rabbitmq 

The gateway service and react app will both watch your code for changes and
update automatically.

## Options

### Run react-app on your host machine in dev mode

```
lecstors-stack stop react-app
yarn workspace @lecstor/react-app run dev
```

### Run react-app with a production build in docker

```
lecstors-stack prod build react-app
lecstors-stack prod recreate react-app
```
Visit http://localhost/

## Kubernetes

Deploy the stack to Kubernetes in Docker Desktop

### Update Kubernetes config from docker-compose config

```
lecstors-stack k8s config
```

### Create namespace in Kubernetes

```
lecstors-stack k8s create
```

### Deploy to Kubernetes

```
lecstors-stack k8s apply
```

### Run the [Cypress](https://www.cypress.io/) end to end testing framework

#### In the UI:

```
lecstors-stack cypress open
```

#### or in the console:

```
lecstors-stack cypress run
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
