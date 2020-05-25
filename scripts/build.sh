DIR=$(dirname $0)
$DIR/setup.sh
(cd server && yarn build)
(cd client && yarn build)
