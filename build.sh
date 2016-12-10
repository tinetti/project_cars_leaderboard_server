#!/bin/bash

VERSION=0.0.2

BUILD_DIR=output/os.linux.x86_64

echo "installing node 0.10"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install 0.10
[ $? == 0 ] || exit 1

echo "building meteor app"
rm -rf $BUILD_DIR
meteor build --directory $BUILD_DIR --architecture=os.linux.x86_64
[ $? == 0 ] || exit 1

# echo "installing node modules"
# (cd $BUILD_DIR/bundle/programs/server && npm install --production)
# [ $? == 0 ] || exit 1

echo "building docker image"
docker build -t pcars_leaderboard_server_meteor .
[ $? == 0 ] || exit 1

echo "tagging docker image"
docker tag pcars_leaderboard_server_meteor tinetti/pcars_leaderboard_server_meteor:$VERSION

echo "pushing docker image"
docker push tinetti/pcars_leaderboard_server_meteor:$VERSION

echo "cleaning up"
rm -rf output

echo "done"
