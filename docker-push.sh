#!/bin/bash

docker build -t pcars_leaderboard_server_meteor .
docker tag pcars_leaderboard_server_meteor tinetti/pcars_leaderboard_server_meteor
docker push tinetti/pcars_leaderboard_server_meteor

