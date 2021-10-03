const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs')
const app = express()
const { exec } = require("child_process");
const port = 8083

app.use(
    bodyParser.json({
        // support JSON-encoded request bodies
        limit: '50mb',
        strict: true
    })
);
app.use(
    bodyParser.urlencoded({
        // support URL-encoded request bodies
        limit: '50mb',
        extended: true
    })
);
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/SceRpcApi/Printer/healthCheck', (req, res) => {
    console.log("hi")
    res.sendStatus(200)
})

app.post('/SceRpcApi/Printer/sendPrintRequest', (req, res) => {
    console.log("hi", req.body)
    const meme = req.body.raw
    var buf = Buffer.from(meme, 'base64');
  
    fs.writeFile('result_buffer.pdf', buf, error => {
        if (error) {
            throw error;
        } else {
            console.log('buffer saved!');
    }
    
        exec("lp -n 1 -o sides=one-sided -d HP_LaserJet_P2015_Series__15CD32_ result_buffer.pdf", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
});
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
