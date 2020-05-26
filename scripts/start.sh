DIR=$(dirname $0)
ROOT=$DIR/..
PORT=80
$DIR/build.sh 
cp -r $ROOT/client/build $ROOT/server/dist/client
npx pm2 start $DIR/ecosystem.config.js