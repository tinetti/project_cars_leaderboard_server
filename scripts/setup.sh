#!/bin/bash

SCRIPTS_DIR="$(cd $(dirname $0) && pwd)"

. ${SCRIPTS_DIR}/.env

docker-machine create --virtualbox-disk-size 4096 --virtualbox-memory 4096 -d virtualbox ${DOCKER_MACHINE}
docker-machine start ${DOCKER_MACHINE}
eval $(docker-machine env ${DOCKER_MACHINE})

(cd ${SCRIPTS_DIR}/..; docker-compose -f ${SCRIPTS_DIR}/docker-compose.yml up -d)

echo "waiting for port 9042"
wait_for_port 9042

echo "setting up cassandra"
${SCRIPTS_DIR}/cassandra/cassandra.sh

echo "done."
