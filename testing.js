const express = require('express');
const bodyParser = require('body-parser');
const { OK, BAD_REQUEST } = { OK: 200, BAD_REQUEST: 400 };

const app = express();
const port = 3001;

let messages = {};
let apiKeys = ['123'];
let clients = {}; // Store the clients for each chatroom

app.use(bodyParser.json());

/**
 * open persistent http connection with
 * /listen?id=chatroom1
 * 
 * send a message to everyone with
 * /send?id=chatroom1&name=bk
 * whoever is listening on chatroom1, SSE is sent to them so they see the message
 * 
 * later in the future, to register an api key:
 * - POST /register, send JWT in auth header
 * - JWT will verify if a user exists in the clark database
 * - API responds with an api key
 * - API stores the mapping of the api key to the user's name
 * 
 */

// Utility function to send message to all clients in a chatroom
const sendToClients = (chatroomId, message) => {
    if (clients[chatroomId]) {
        clients[chatroomId].forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));
    }
};

// SSE endpoint to listen for messages in a chatroom
app.get('/listen', (req, res) => {
    const chatroomId = req.query.id;
    if (!chatroomId) {
        return res.status(BAD_REQUEST).send('Chatroom ID is required');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!clients[chatroomId]) {
        clients[chatroomId] = [];
    }

    clients[chatroomId].push({ id: Date.now(), res });

    req.on('close', () => {
        clients[chatroomId] = clients[chatroomId].filter(client => client.res !== res);
    });
});

// Endpoint to send a message to a chatroom
app.post('/send', (req, res) => {
    const { id, message } = req.body;

    // Store the message (optional)
    if (!messages[id]) {
        messages[id] = [];
    }
    messages[id].push(message);

    // Broadcast the message to all clients in the chatroom
    sendToClients(id, { message });

    res.json({ status: 'Sent' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
