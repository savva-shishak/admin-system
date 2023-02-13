import Router from 'koa-router';
import Koa from 'koa';
import https from 'https';
import http from 'http';
import { Server as WebsocketServer } from 'socket.io';
import fs from 'fs';
import koaBody from 'koa-body';
import koaLogger from 'koa-logger';
import cors from 'koa-cors';
import config from './config';
import serve from 'koa-static';
import mount from 'koa-mount';

export const koa = new Koa();
export const mainRouter = new Router();

export const httpServer = 
  process.env.SSL_MODE === 'off'
  ? http.createServer(koa.callback())
  : https.createServer(
    {
      cert: fs.readFileSync(config.ssl.crt),
      key: fs.readFileSync(config.ssl.key),
    },
    koa.callback()
  )
;

export const io = new WebsocketServer(httpServer, { cors: { origin: '*' } });

koa.use(cors({ origin: '*' }));
koa.use(mount(config.staticUrl, new Koa().use(serve(config.static))));
koa.use(koaBody({ multipart: true }));
koa.use(koaLogger());
koa.use(mainRouter.allowedMethods());
koa.use(mainRouter.routes());

export const appContext = {
  koa,
  httpServer,
  mainRouter,
  io,
}

export type AppContext = typeof appContext

export default appContext;