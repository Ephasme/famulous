DIR=$(dirname $0)
ROOT=$DIR/..
$DIR/build.sh && \
npx pm2 start $ROOT/server/dist/app/index.js \
    --name famulous \
    --exp-backoff-restart-delay=100