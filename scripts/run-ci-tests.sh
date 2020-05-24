DIR=$(dirname $0)
yarn
(cd $DIR/../server && CI=true yarn test)
(cd $DIR/../client && CI=true yarn test)