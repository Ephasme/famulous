yarn build && \
pm2 start ./server/dist/app/index.js \
    --name famulous \
    --exp-backoff-restart-delay=100