/**
 * This is the API server for handling data requests for Mr. Roboto
 *
 * To run this app in development mode, use the "npm dev" command
 * To run this app in production mode, use the "npm start" command
 */

import * as Koa from 'koa';
import * as Router from 'koa-router';

import { Controller } from './controller';

const errorResponse = `
<body style="font-family: arial">
    <h1>Page not found!</h1>
    You requested in the wrong neighborhood <br />
    <iframe src='https://gfycat.com/ifr/FluidSparklingIndianrockpython' frameborder='0' scrolling='no' allowfullscreen width='640' height='412'></iframe>
    <p> <a href="https://gfycat.com/fluidsparklingindianrockpython">via Gfycat</a></p>
</body>
`;
const PORT = 8080;

const app = new Koa();

// Define global middleware here
app.use(async (ctx, next) => {
    // Log the request to the console
    console.log('Url:', ctx.url);
    // Pass the request to the next middleware function
    await next();
    // Do stuff after the middleware stack is empty here
});

const router = new Router();

// Define API endpoints here
router.get('/test', async ctx => {
    ctx.status = 200;
    Controller.sendTestMsg(ctx);
});
router.get('/*', async ctx => {
    ctx.status = 404;
    ctx.body = errorResponse;
});

app.use(router.routes());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);
