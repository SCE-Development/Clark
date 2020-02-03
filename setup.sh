#!/bin/bash
function install_rpc_client(){
    cd "printingRPC/"
    npm install
    cd ..
}

function install_rpc_server(){
    cd "printingRPC/"
    pip3 install -r requirements.txt --user
    cd ..
}

# clone printingRPC repository
rm -rf printingRPC/
git clone https://github.com/jerrylee17/printingRPC.git
install_rpc_client
install_rpc_server
