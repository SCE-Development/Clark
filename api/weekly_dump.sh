#!/bin/bash

export PATH=/bin:/usr/bin:/usr/local/bin
DATABASE_NAMES='ALL'
if [ ${DATABASE_NAMES} = "ALL" ]; then
 echo "Backing up databases"
 mkdir /Users/farahmasood/Desktop/dump/$(date +"%d%b%Y")
 mongodump -o /Users/farahmasood/Desktop/dump/$(date +"%d%b%Y")
 zip -r $(date +"%d%b%Y").zip /Users/farahmasood/Desktop/dump/$(date +"%d%b%Y")
 mv /Users/farahmasood/Documents/GitHub/Core-v4/07Jan2021.zip /Users/farahmasood/Desktop/dump
fi