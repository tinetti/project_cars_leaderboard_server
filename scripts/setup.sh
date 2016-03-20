#!/bin/bash

SCRIPTS_DIR="$(cd $(dirname $0) && pwd)"

. ${SCRIPTS_DIR}/.env

echo "creating docker machine"
docker-machine create --virtualbox-disk-size 4096 --virtualbox-memory 4096 -d virtualbox ${DOCKER_MACHINE}

echo "stopping docker machine"
docker-machine stop ${DOCKER_MACHINE}

PORTS="9042 6379"
for i in ${PORTS}; do
    echo "setting up port forwarding: ${i}"
    VBoxManage modifyvm ${DOCKER_MACHINE} --natpf1 "tcp-port-$i,tcp,,$i,,$i" 2>/dev/null
done

echo "starting docker machine"
docker-machine start ${DOCKER_MACHINE}

echo "setting up containers"
eval $(docker-machine env ${DOCKER_MACHINE})
(cd ${SCRIPTS_DIR}/..; docker-compose -f ${SCRIPTS_DIR}/docker-compose.yml up -d)

echo "setting up cassandra"
${SCRIPTS_DIR}/cassandra/cassandra.sh

echo "done."
