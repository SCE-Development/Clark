const express = require('express');
const mongoose = require('mongoose'); // To interact with mongodb
const bodyParser = require('body-parser'); // take requests and get data from body
const cors = require('cors');

// to access the api and the requests
const app = express();

app.use(cors());
// Bodyparser Middleware
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// connect to mongoDB via mongoose 
mongoose
    .connect(db)
    .then (() => console.log('DB connected...'))
    .catch(err => console.log(err));

const api = require ('./routes/api');

// any url with /api/items will get the file 'items'
app.use('/api', api);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log (`Server started on ${port}`));

module.exports = app