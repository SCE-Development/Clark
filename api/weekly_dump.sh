#!/bin/bash

export PATH=/bin:/usr/bin:/usr/local/bin
DATABASE_NAMES='ALL'
if [ ${DATABASE_NAMES} = "ALL" ]; then
 echo "Backing up databases"
 mongodump
fi