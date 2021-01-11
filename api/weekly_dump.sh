#!/bin/bash
export PATH=/bin:/usr/bin:/usr/local/bin
# change DUMP_DIR to the absolute path to mongo dumps directory
DUMP_DIR="/Users/admin/Desktop/sce/dbdump"
PROJECT_DIR=$PWD
DB_NAME="sce_core"
echo "Backing up databases"
mongodump --db $DB_NAME --gzip --archive > $DUMP_DIR/$(date +"%d%b%Y")_$DB_NAME.gzip
echo "Done backing up sce_core"