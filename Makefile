#------------------------------------------------------------------------------
# Docker Build

dc-build-app-dev:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
	docker-compose build react-app

dc-build-app-prod:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
	TARGET=production docker-compose build react-app

#------------------------------------------------------------------------------
# NPM Build

config:
	yarn workspace @lecstor/config run build

nuke-node_modules:
	rm -r node_modules; for d in {apps,modules,services,tools}/*/node_modules; do echo $d; rm -r $d; done

#------------------------------------------------------------------------------
# Database

db-migrate:
	docker-compose run gateway yarn workspace @lecstor/gateway db:migrate

db-rollback:
	docker-compose run gateway yarn workspace @lecstor/gateway migrate:rollback

#------------------------------------------------------------------------------
# Testing
cypress-open:
	yarn workspace @lecstor/cypress open

#------------------------------------------------------------------------------
.PHONY: config dev prod
