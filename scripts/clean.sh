#!/bin/bash
rm -rf dist
rm -rf logs
rm -rf client/build
find . -type f -name '*.log' -exec rm -f {} +
find . -type d -name 'node_modules' -exec rm -rf {} +