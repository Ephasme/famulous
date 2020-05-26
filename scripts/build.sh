DIR=$(dirname $0)
ROOT=$DIR/..
$DIR/setup.sh
(cd server && yarn build)
(cd client && yarn build)
cp -r $ROOT/client/build $ROOT/server/dist/client
