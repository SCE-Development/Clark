#!/bin/bash

# remove any existing printRPC directory
rm -rf printingRPC/
# clone printingRPC repository
git clone https://github.com/jerrylee17/printingRPC.git
cd printingRPC
# run the repo's setup script
./setup.sh
# get the heck out of there
cd ..
