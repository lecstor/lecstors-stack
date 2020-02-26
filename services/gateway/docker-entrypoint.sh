#!/bin/sh
set -e

./wait-for.sh postgres:5432

yarn workspace @lecstor/gateway run db:migrate

exec "$@"