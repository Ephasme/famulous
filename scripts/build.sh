#!/bin/bash
(cd server && yarn && yarn build)
(cd client && yarn && yarn build)
