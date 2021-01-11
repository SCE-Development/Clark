#!/bin/bash
export PATH=/bin:/usr/bin:/usr/local/bin
# change DUMP_DIR
DUMP_DIR="/Users/admin/Desktop/sce/dbdump"
DB_NAME="sce_core"
echo "Backing up databases"
mongodump --db $DB_NAME --gzip --archive > $DUMP_DIR/$(date +"%d%b%Y")_$DB_NAME.gz
echo "Done backing up sce_core"
# restore command
# mongorestore --gzip --archive=$DUMP_DIR/<dumpfilename> --db sce_core --noIndexRestore --drop
# example: mongorestore --gzip --archive=/Users/admin/Desktop/sce/dbdump/11Jan2021.gz --db sce_core --noIndexRestore --drop
# 
# Running this script weekly using a crontab:
# command line: sudo crontab -u <user> -e               # edit crontab
# inside crontab: 0 0 * * 0 root <pathtothisscript>     # runs script on Sundays at 00:00 
