const {SceHttpServer} = require('../util/SceHttpServer');
function main(){
    const API_ENDPOINT = [
        __dirname + '/routes/Dessert.js'
    ];
    const dessertServer = new SceHttpServer(API_ENDPOINT,8084,'/dessert_api/');
    dessertServer.initializeEndpoints().then(()=>{
        dessertServer.openConnection()
    })

}

main();

module.exports = {main};