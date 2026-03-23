#!/bin/bash

#openssl rand -base64 756 > mongo-keyfile
#chmod 400 mongo-keyfile

CONTAINER_NAME="mongo-rs"
ROOT_USER="root"
ROOT_PASS="root123"

docker run -d \
  --name $CONTAINER_NAME \
  -p 27017:27017 \
  -v $(pwd)/mongo-keyfile:/etc/mongo-keyfile \
  -e MONGO_INITDB_ROOT_USERNAME=$ROOT_USER \
  -e MONGO_INITDB_ROOT_PASSWORD=$ROOT_PASS \
  -v mongo-data:/data/db \
  mongo:7 \
  mongod --replSet rs0 --auth --keyFile /etc/mongo-keyfile --bind_ip_all

echo "MongoDB container started..."