#!/bin/bash

echo "Waiting for MongoDB to be ready..."
sleep 5

docker exec -i mongo-rs mongosh \
  -u root -p root123 --authenticationDatabase admin <<EOF
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }]
});

use admin;

db.createUser({
  user: "ecommerce",
  pwd: "QVbGqKP3S34jbcIUfre9KzmgRyE",
  roles: [{ role: "readWrite", db: "ecommerce" }]
});
EOF

echo "MongoDB initialized (replica set + user)"