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

const errorResponse = (`
<body style="font-family: arial">
    <h1>Page not found!</h1>
    You requested in the wrong neighborhood <br />
    <iframe src='https://gfycat.com/ifr/FluidSparklingIndianrockpython' frameborder='0' scrolling='no' allowfullscreen width='640' height='412'></iframe>
    <p> <a href="https://gfycat.com/fluidsparklingindianrockpython">via Gfycat</a></p>
</body>
`);

//Define API Routes/endpoints here
//Routes are resolved in order, from top to bottom. If a request is matched to multiple routes, it will be sent to just the first match (unless that match is middleware)

app.get('/msg', controller.sendTestMsg);

app.get('*', (req, res) => res.status(404).send(errorResponse));


app.listen(port, () => console.log(`Express app started and listening on port ${port}.`));