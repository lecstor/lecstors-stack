# WIP! - not fully functional

# Lecstor's Stack

## Create a database

```
docker exec -it postgres psql -U postgres -c "create database lecstor"
```

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

You can run production builds by overriding the compose config.

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
yarn gateway:local
```

### with a production build

```
yarn gateway:build
yarn gateway:start:local
```

start - dev build, localhost
build:prod - prod build, localhost
start:prod - prod build, localhost

