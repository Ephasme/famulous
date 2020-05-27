#!/bin/bash
(cd server && yarn && \
    ls -al node_modules/.bin && \
    yarn build)
(cd client && yarn && yarn build)
