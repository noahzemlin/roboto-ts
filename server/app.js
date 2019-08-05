/**
 * This is the API server for handling data requests for Mr. Roboto
 * 
 * To run this app in development mode, use the "npm test" command
 * To run this app in production mode, use the "npm start" command
 */
const express = require('express');
const app = express();
const port = 8080;
const controller = require('./controller');

app.get('/msg', controller.sendTestMsg);

app.get('/', (req, res) => res.send('Hello World!'));


app.listen(port, () => console.log(`Express app started and listening on port ${port}.`));