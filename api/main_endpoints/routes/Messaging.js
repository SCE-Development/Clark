const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;

let messages  = {}
let apiKeys = ['123']

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

// https://dev.to/techfortified/realtime-data-streaming-using-server-sent-eventssse-with-reactjs-and-nodejs-2aak

router.get('/getMessages', (req, res) => {
    res.status(200).send("idiot")
    // res.json({'messages' : messages})
});

router.post('/sendMessage', (req, res) => {
    if(apiKeys.includes(req.body.apiKey)){
        messages[req.body.user_to_send] = req.body.message
        res.json({'status' : 'Sent'})
    }
});


module.exports = router;
