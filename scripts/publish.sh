#!/bin/bash

npm update

VERSION=`echo "console.log(require('./package.json').version)" | node`

git checkout -b build

npm install
git add dist/* -f
git add bower.json -f

git commit -m "v$VERSION"

git tag v$VERSION -f
git push origin build --tags -f
