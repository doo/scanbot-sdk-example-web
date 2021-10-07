#!/bin/bash
set -ex

cd angular-js/
npm install
ng build

# to start the dev server run: 
# ng serve