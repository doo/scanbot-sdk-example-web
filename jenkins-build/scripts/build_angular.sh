#!/bin/bash
set -ex

cd angular-js/
npm install -g @angular/cli
ng build

# to start the dev server run: 
# ng serve