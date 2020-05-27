#!/bin/bash
rm -rf logs
rm -rf client/build
rm -rf server/dist
find . -type f -name '*.log' -exec rm -f {} +
find . -type d -name 'node_modules' -exec rm -rf {} +