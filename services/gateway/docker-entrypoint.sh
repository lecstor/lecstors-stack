#!/bin/sh
set -e

yarn workspace @lecstor/gateway run db:migrate
# > /dev/null 2>&1

exec "$@"