let clients = [];

function writeLogToClient (response) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(response)}\n\n`);
  });
  
};

module.exports = { writeLogToClient, clients};