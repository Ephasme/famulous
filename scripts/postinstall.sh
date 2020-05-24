DIR=$(dirname $0)
(cd $DIR/../server && yarn)
(cd $DIR/../client && yarn)