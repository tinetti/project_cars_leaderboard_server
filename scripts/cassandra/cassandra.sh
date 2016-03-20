#!/bin/bash

SCRIPTS_DIR="$(cd $(dirname $0)/.. && pwd)"

. ${SCRIPTS_DIR}/.env

CASSANDRA_CONTAINER_NAME="scripts_cassandra_1"
CQLSH_HOST=$(docker-machine ip ${DOCKER_MACHINE})
CQLSH_PORT=$(docker port ${CASSANDRA_CONTAINER_NAME} 9042 | sed -E 's/^.*:(.*)$/\1/')

docker exec ${CASSANDRA_CONTAINER_NAME} cqlsh -f cassandra/keyspace.cql

exit ${ALL_STATUS:-0}
