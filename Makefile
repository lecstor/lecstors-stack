#------------------------------------------------------------------------------
# Docker Build

dc-up:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
	docker-compose up -d && docker-compose logs -f

dc-build-app-dev:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
	docker-compose build react-app

dc-build-app-prod:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
	docker-compose --env-file=.env-prod build react-app

dc-restart-react-app-prod:
	docker-compose --env-file=.env-prod stop react-app
	docker-compose --env-file=.env-prod up -d react-app

dc-build-gateway-dev:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
	docker-compose build gateway

dc-build-gateway-prod:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
	docker-compose --env-file=.env-prod build gateway

dc-restart-gateway-dev:
	docker-compose stop gateway
	docker-compose up -d gateway

dc-restart-gateway-prod:
	docker-compose --env-file=.env-prod stop gateway
	docker-compose --env-file=.env-prod up -d gateway

#------------------------------------------------------------------------------
# NPM Build

config:
	yarn workspace @lecstor/config run build

nuke-node_modules:
	rm -r node_modules; for d in {apps,modules,services,tools}/*/node_modules; do echo $d; rm -r $d; done

#------------------------------------------------------------------------------
# Testing

test:
	yarn wsrun --skip-missing -c test

cypress-open:
	yarn workspace @lecstor/cypress open

#------------------------------------------------------------------------------
# Kubernetes
k8s-config-prod:
	BUILD_TARGET=production TAG=production kompose convert -o kubernetes/production/kompose

k8s-create:
	kubectl create namespace lecstors-prod

k8s-apply:
	kubectl apply -n lecstors-prod -R -f kubernetes/production

#------------------------------------------------------------------------------
.PHONY: config dev prod

#------------------------------------------------------------------------------
# https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#proxy
# Listen on port 8888 locally, forwarding to 5000 in the pod
# kubectl port-forward pod/mypod 8888:5000
# kubectl port-forward pod/react-app-6466f45899-kpspd 5000:80

# kubectl exec gateway-6788c6fbb5-ddf7z yarn db:migrate -- --knexfile dist/knexfile.js
# kubectl exec -it react-app-7db4c47589-8dv6m -n lecstors-prod -- /bin/sh
