DIR=$(dirname $0)
ROOT=$DIR/..
rm -rf node_modules \
    $ROOT/client/build \
    $ROOT/client/node_modules \
    $ROOT/client/build \
    $ROOT/server/node_modules \
    $ROOT/server/dist
yarn
(cd $ROOT/server && yarn)
(cd $ROOT/client && yarn)