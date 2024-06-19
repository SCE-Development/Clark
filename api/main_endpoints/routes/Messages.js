const {
    UNAUTHORIZED,
    FORBIDDEN
} = require('../../util/constants').STATUS_CODES;
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const apiKeys = {
    user1: 'apikey1',
    user2: 'apiKey2',
    user3: 'apiKey3',
};

const clients = {};

const writeMessaage = ((roomId, message) => {
    if (clients[roomId]) {
        clients[roomId].forEach(client => client.res.write(`${JSON.stringify(message)}\n\n`));
    }
})

router.post('/send', (req, res) => {
    const {apiKey, message, id} = req.body;
    if(!apiKey || !message || !id){
        res.sendStatus(FORBIDDEN);
        return;
    }else if(!Object.values(apiKeys).includes(apiKey)){
        res.sendStatus(UNAUTHORIZED);
        return;
    }
    writeMessaage(id, message);
    return res.json({status: 'Message sent'});

});

router.get('/listen', (req, res) => {
    const {apiKey, id} = req.query;
    if(!apiKey || !id){
        res.sendStatus(FORBIDDEN);
        return;
    } else if(!Object.values(apiKeys).includes(apiKey)){
        res.sendStatus(UNAUTHORIZED);
        return;
    }

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    res.writeHead(200, headers);

    if(!clients[id]){
        clients[id] = [];
    }

    clients[id].push({res});

    req.on('close', () => {
        if(clients[id]){
            clients[id] = clients[id].filter(client => client !== res);
        }
        if(clients[id].length === 0){
            delete clients[id];
        }
    });

});

module.exports = router;