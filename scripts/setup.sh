#!/bin/sh
DIR=$(dirname $0)
ROOT=$DIR/..
rm -rf node_modules \
    $ROOT/client/build \
    $ROOT/client/node_modules \
    $ROOT/client/build \
    $ROOT/server/node_modules \
    $ROOT/server/dist
yarn
echo "installing server dependencies"
(cd $ROOT/server && yarn)
echo "installing client dependencies"
(cd $ROOT/client && yarn)