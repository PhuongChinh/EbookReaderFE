#!/bin/bash
SRC_DIR="/home/ubuntu/tx-scm/source/traxem-main"
DEP_DIR="/usr/share/nginx/main"

CUDIR=`pwd`
cd "${SRC_DIR}"
git pull

#npm i;

#sh "${SRC_DIR}/scripts/build-angular.sh"

#npm i;
echo "clear old app files"
sudo rm -rf "${DEP_DIR}/"

echo "copy new app files"
sudo cp -R "${SRC_DIR}/app/prod/" "${DEP_DIR}/"

sudo chown -R ubuntu:ubuntu "${DEP_DIR}";
sudo chmod -R 755 "${DEP_DIR}";


cd ${CUDIR}

#echo "check files exists"
#ls -al "${DEP_DIR}"

echo "check file size"
du -sh "${DEP_DIR}/"

du -sh "${DEP_DIR}/assets/"


echo "clear cached and restart server"
sudo rm -rf /var/cache/nginx/*

sudo systemctl restart nginx

echo "Done";
