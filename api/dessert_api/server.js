const { model } = require('mongoose');
const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
    const API_ENDPOINTS = __dirname + '/routes/';
    const cloudServer = new SceHttpServer(API_ENDPOINTS, 8084, '/dessert_api/');
    cloudServer.init().then(() => {
        cloudServer.openConnection();
    });
}

main();

// structure:
// localhost:[port]/[name_of_api]/[name_of_routes]/[endpoint]