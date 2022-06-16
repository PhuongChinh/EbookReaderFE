#!/bin/bash

# Create a package for application
#------------------------------------------------------------------------------------
PROJ_DIR=`pwd`
PROJ_NAME='tx-main'
PROJ_SRC_DIRNAME='./app/prod'

TAR_DIR="./app"
TAR_NAME="${PROJ_NAME}.tar.gz"
TAR_TARGET="${TAR_DIR}/${TAR_NAME}"

echo "Current script directory: ${PROJ_DIR}"
# Make a target dir if any
mkdir -p "${TAR_DIR}"
rm -f "${TAR_TARGET}"

echo "Parent directory: `pwd`"

# Make a tarball for project and put it to target dir
tar -cvz -X "${PROJ_DIR}/.tar-excludes" -f "${TAR_TARGET}" "${PROJ_SRC_DIRNAME}"

# Back to orginal dir
cd "${PROJ_DIR}"

# Verify
tar -tvzf "${TAR_TARGET}"

# Guide
echo "Deploy to remote server as following steps"
echo "Copy archived file to remote server: scp ${TAR_TARGET} blue@my.server.com:/tmp/"
echo "Remote access the server: ssh blue@my.server.com"
echo "Run deploy script: sudo sh deploy_app.sh"


SERVER='t93'

scp "${TAR_TARGET}" ${SERVER}:/tmp



