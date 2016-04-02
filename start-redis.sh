#!/bin/bash

docker-machine start default
eval $(docker-machine env default)
docker stop pcars-redis
docker rm pcars-redis
docker run --name pcars-redis -p 6379:6379 -d redis redis-server
