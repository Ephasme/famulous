#!/bin/sh
DIR=$(dirname $0)
ROOT=$DIR/..
$DIR/setup.sh
(yarn --cwd $ROOT/server build)
(yarn --cwd $ROOT/client build)
cp -r $ROOT/client/build $ROOT/server/dist/client
