#!/bin/bash

# Create a package for application
#------------------------------------------------------------------------------------
PROJ_DIR=`pwd`
BASE_DIR="${PROJ_DIR}"

echo "Starting build..."

cd ${BASE_DIR}

ng build --prod

cd ${PROJ_DIR}

echo "Clear unused script"

#sed -i '/window\.apiUrl/d' "${PROJ_DIR}/server/public/index.html"

echo "Build process completed"

git add .; git commit -m "Update build files for test-server";git push;
