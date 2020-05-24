rm -rf node_modules client/build client/node_modules client/build server/node_modules server/dist
yarn
(cd server && yarn && yarn lint && CI=true yarn test && yarn build)
(cd client && yarn && CI=true yarn test && yarn build)
