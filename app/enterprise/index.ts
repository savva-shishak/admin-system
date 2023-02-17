import moment from "moment";
import { Model } from "sequelize";
import { mainRouter } from "../context";
import { reduceArrayByParams } from "../lib/tables/reduceArrayByParams";
import { sequlizeQueryByParams } from "../lib/tables/sequlizeQueryByParams";
import { InputForm } from "../lib/types";
import { admin, users } from "./auth-and-connect-admin";
import { Log } from "./log";

admin.pages.push({
  path: '/',
  title: 'Журнал событий',
  content(params, client, api) {
    return [
      {
        type: 'table',
        columns: [
          {
            key: 'id',
            title: 'ID',
            type: 'num',
          },
          {
            key: 'text',
            title: 'Информация',
            type: 'str',
          },
          {
            key: 'type',
            title: 'Тип события',
            type: 'enum',
            values: ['info', 'error', 'warning', 'success'],
          },
          {
            key: 'datetime',
            title: 'Дата и время',
            type: 'date',
            format: 'DD.MM.YYYY hh:mm:ss'
          },
          {
            key: 'roomId',
            title: 'Комната',
            type: 'str',
          },
          {
            key: 'peerId',
            title: 'ID пользователя',
            type: 'key',
          },
          {
            key: 'displayName',
            title: 'Имя пользователя',
            type: 'str',
          },
          {
            key: 'browser',
            title: 'Браузер',
            type: 'str',
          },
          {
            key: 'avatar',
            title: 'Аватар',
            type: 'img',
          }
        ],
        getData: sequlizeQueryByParams(
          Log,
          [
            'displayName',
            'browser',
            'text',
            'roomId'
          ],
          // (item) => ({
          //   id: item.id,
          //   peerId: item.peerId.slice(0, 5) + '...',
          //   displayName: item.displayName,
          //   datetime: item.datetime,
          //   type: item.type,
          //   browser: item.browser,
          //   text: item.text,
          //   roomId: item.roomId,
          //   avatar: 'https://w7.pngwing.com/pngs/805/207/png-transparent-account-avatar-profile-user-avatars-icon.png'
          // })
        )
      }
    ]
  },
})

mainRouter.post('/add-logs', async (ctx) => {
  const logs = ctx.request.body as Omit<Log, keyof Model>[];

  console.log(logs);
  

  try {
    await Log.bulkCreate(logs);
  
    ctx.status = 204;
  } catch (e) {
    ctx.status = 400;
    console.log(e);
    
    ctx.body = e;
  }
})