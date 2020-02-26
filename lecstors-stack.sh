#!/bin/bash
###
# source this file from your ~/.bashrc or ~/.bash_profile so it is loaded
# in new console instances, eg..
# $ echo "source ~/lecstors-stack/lecstors-stack.sh" >> ~/.bashrc
# source this file in a console to try it now, eg..
# $ source ./lecstors-stack
###

# `lecstors-stack` will call `docker-compose` with the preferred ENV vars set
#   - COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1
#     - these enable us to use per-package dockerIgnore files to optimise the docker
#       context copied during a build
#   - BUILD_TARGET, NODE_ENV, TAG
#     - will all be set to either "development" or "production"
#   - COMPOSE_FILE
#     - loads the base docker-compose.yml and the dev or prod docker-compose.*.yml
#     - defaults to dev if `prod` is not the first argument to `lecstors-stack`


# use it to run all you favourite docker-compose commands..

#   check docker-compose config to be used for dev
#   $ lecstors-stack config 
#   $ lecstors-stack dev config 
#       docker-compose config
#
#   check docker-compose config to be used for prod
#   $ lecstors-stack prod config 
#       docker-compose config

#   $ lecstors-stack up
#       docker-compose up

#   $ lecstors-stack stop gateway
#       docker-compose stop gateway

#   $ lecstors-stack restart react-app gateway
#       docker-compose restart react-app gateway


# it also has some custom convenience commands

#   $ lecstors-stack upl react-app gateway
#       docker-compose up -d react-app gateway
#       docker-compose logs -f --tail=5 react-app gateway

#   $ lecstors-stack recreate
#       docker-compose up -d --no-deps --force-recreate

#   $ lecstors-stack stopup react-app gateway
#       docker-compose stop react-app gateway
#       docker-compose up -d --no-deps react-app gateway
#       docker-compose logs -f --tail=5 react-app gateway

#   $ lecstors-stack update
#       docker-compose pull --ignore-pull-failures
#       docker-compose up -d --force-recreate
#       docker-compose logs -f --tail=5

#   $ lecstors-stack k8s create my-namespace
#       kubectl create namespace "${3-lecstors-prod}"

#   $ lecstors-stack k8s config
#       BUILD_TARGET=production TAG=production kompose convert -o kubernetes/production/kompose

#   $ lecstors-stack k8s apply my-namespace
#       kubectl apply -n my-namespace -R -f kubernetes/production

lecstors-stack () {

  help () {
cat <<-END

Usage:
  $ lecstors-stack [dev|prod] [command or docker-compose command]
------
  help | -h | --help   - display this help
  config               - rebuild the copin config module
  cypress
      open             - open cypress locally
      run              - run cypress locally
      up               - run cypress in docker
  recreate [service/s] - stop and upl
  stopup [service/s]   - stop and up
  stopupl [service/s]  - stop and upl
  test                 - run all tests locally (yarn test && cypress)
  update               - pull updated images and recreate
  upl [service/s]      - bring up services (detached and logged)
  k8s
      config             - update Kubernetes config from docker-compose
      create [namespace] - create a namespace
      apply [namespace]  - apply the config to the cluster

END
  }

  dc-raw () {
    local mode="dev"
    local build_target="development"
    local node_env="development"
    if [ "$1" = "prod" ]
    then
      mode="prod"
      build_target="production"
      node_env="production"
    fi

    shift $((1)) # remove mode arg

    local OPTIND=1

    while getopts ":tp" opt; do
      case ${opt} in
        t )
          node_env="test"
          ;;
        p )
          node_env="production"
          ;;
        \? ) echo "Usage: cmd [-t]"
          ;;
      esac
    done

    shift $((OPTIND - 1)) # remove any opts
    
cat <<-END
  COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \\
  COMPOSE_FILE=docker-compose.yml:docker-compose.${mode}.yml \\
  BUILD_TARGET=${build_target} NODE_ENV=${node_env} TAG=${build_target}-${node_env} \\
  docker-compose ${@}

END
    COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
    COMPOSE_FILE=docker-compose.yml:docker-compose."${mode}".yml \
    BUILD_TARGET="${build_target}" NODE_ENV="${node_env}" TAG="${build_target}-${node_env}" \
    docker-compose "${@}"
  }

  kubernetes () {
    case $2 in
      config)
        BUILD_TARGET=production TAG=production kompose convert -o kubernetes/production/kompose
        ;;
      create)
        kubectl create namespace "${3-lecstors-prod}"
        ;;
      apply)
        kubectl apply -n "${3-lecstors-prod}" -R -f kubernetes/production
        ;;
      \? ) echo "Usage: k8s config | create | apply"
        ;;
      # *)
      #   dc-raw "$@"
      #   ;;
    esac

  }

  cypress () {
    case $2 in
      open)
        yarn workspace @lecstor/cypress run open
        ;;
      run)
        yarn workspace @lecstor/cypress run run
        ;;
      up)
        dc-raw dev up --no-deps cypress
        ;;
      # *)
      #   dc-raw "$@"
      #   ;;
    esac

  }

  dc-command () {
    case $2 in
      config)
        yarn workspace @lecstor/config run "${3-build}"
        ;;
      cypress)
        cypress "$1" "${@:3}"
        ;;
      k8s)
        kubernetes "$1" "${@:3}"
        ;;
      recreate)
        dc-raw "$1" up -d --force-recreate --no-deps "${@:3}" \
        && dc-raw "$1" logs -f --tail=0 "${@:3}"
        ;;
      remove-node_modules)
        rm -r node_modules
        for d in {apps,modules,services,tools}/*/node_modules;
          do echo "$d"
          rm -r "$d"
        done
        ;;
      stopup)
        dc-raw "$1" stop "${@:3}" \
        && dc-raw "$1" up -d --no-deps "${@:3}"
        ;;
      stopupl)
        dc-raw "$1" stop "${@:3}" \
        && dc-raw "$1" up -d --no-deps "${@:3}" \
        && dc-raw "$1" logs -f --tail=0 "${@:3}"
        ;;
      test)
        yarn wsrun --skip-missing -c test \
        && yarn workspace @lecstor/cypress run run
        ;;
      update)
        dc-raw "$1" pull --ignore-pull-failures \
        && dc-raw "$1" up -d --force-recreate \
        && dc-raw "$1" logs -f --tail=0
        ;;
      upl)
        dc-raw "$1" up -d "${@:3}" \
        && dc-raw "$1" logs -f --tail=0 "${@:3}"
        ;;
      "docker-stats")
        docker stats $(docker ps --format="{{.Names}}")
        ;;
      "docker-ram")
        docker run --rm --privileged debian:jessie-slim df -h
        ;;
      "docker-inode")
        docker run --rm --privileged debian:jessie-slim df -h -i
        ;;
      help | -h | --help)
        help
        ;;
      *)
        dc-raw "$@"
        ;;
    esac
  }

  mode="dev"
  if [ "$1" = "prod" ] || [ "$1" = "dev" ]
  then
    mode="$1"
    args=("${@:2}")
  else
    args=("$@")
  fi
  dc-command "${mode}" "${args[@]}"
}

"$@"
