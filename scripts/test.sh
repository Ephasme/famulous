#!/bin/bash
if [ ! $CI ]; then
    WATCH="--watch"
fi

concurrently -n server,client \
    "jest $WATCH" \
    "yarn --cwd client test"