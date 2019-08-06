import * as Koa from 'koa';

export class Controller {
    public static sendTestMsg (ctx: Koa.Context) {
        ctx.body = {msg: 'This is only a test. This is a test for the test.'};
    };
}