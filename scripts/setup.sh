rm -rf node_modules client/build client/node_modules client/build server/node_modules server/dist
yarn
(cd server && yarn)
(cd client && yarn)