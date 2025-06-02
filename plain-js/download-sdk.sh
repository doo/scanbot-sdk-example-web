#!/bin/bash

set -e

VERSION=7.2.0

rm -rf scanbot-web-sdk/

mkdir -p scanbot-web-sdk/
cd scanbot-web-sdk
npm pack scanbot-web-sdk@${VERSION}
tar -xf scanbot-web-sdk-${VERSION}.tgz --strip-components=2 package/bundle
rm scanbot-web-sdk-${VERSION}.tgz
