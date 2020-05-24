yarn
(cd server && yarn lint && CI=true yarn test && yarn build)
(cd client && CI=true yarn test && yarn build)

