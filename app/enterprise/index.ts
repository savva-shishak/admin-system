import { Model } from "sequelize";
import { mainRouter } from "../context";
import { Log } from "./log";
import { userAgent, UserAgentContext } from 'koa-useragent';
import { BaseContext } from "koa";
import moment from "moment";
import 'moment';

import "./all-logs";
import "./one-log";

moment.locale('ru');

mainRouter.post<BaseContext, UserAgentContext>('/add-logs', userAgent, async (ctx) => {
  const log = ctx.request.body as Omit<Log, keyof Model | 'userAgent' | 'datetime'>;

  try {
    await Log.create({
      ...log,
      userAgent: ctx.userAgent as any,
      datetime: new Date(),
    });
  
    ctx.status = 204;
  } catch (e) {
    ctx.status = 400;
    console.log(e);
    
    ctx.body = e;
  }
})