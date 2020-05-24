yarn
(cd server && yarn && yarn lint && CI=true yarn test && yarn build)
(cd client && yarn && CI=true yarn test && yarn build)
mkdir -p dist/client
cp -r client/build dist/client/

