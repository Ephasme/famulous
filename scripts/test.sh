#!/bin/sh
(cd server && yarn && yarn lint && CI=true yarn test)
(cd client && yarn &&              CI=true yarn test --passWithNoTests)