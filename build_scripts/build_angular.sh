#!/bin/bash
set -ex

cd angular-js/
ng serve
ng build
ng test
ng e2e