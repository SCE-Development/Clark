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
        clients[roomId].forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));
    }
})

router.post('/send', (req, res) => {
    const {apiKey, message, id} = req.body;
    if(Object.values(apiKeys).includes(apiKey)){
        writeMessaage(id, message);
        return res.json({status: 'Message sent'});
    }
    res.status(401).json({error: 'Invalid API Key'});

    
});

router.post ('/listen', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    res.writeHead(200, headers);

    const {apiKey, id} = req.body;
    if(Object.values(apiKeys).includes(apiKey)){
        if(!clients[id]){
            clients[id] = [];
        }
        clients[id].push({res});
    }

    req.on('close', () => {
        clients[id] = clients[id].filter(client => client !== res);
    });
    
});

module.exports = router;

