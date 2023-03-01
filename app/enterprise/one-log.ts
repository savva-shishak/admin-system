import { admin } from "./auth-and-connect-admin";
import { Log } from "./log";
import { reduceArrayByParams } from "../lib/tables/reduceArrayByParams";
import moment from "moment";
import 'moment';

admin.pages.push({
  path: '/log/:id',
  title: 'Информация о событии',
  async content({ id }, client, api) {
    const log = await Log.findOne({ where: { id } });

    if (!log) {
      setTimeout(() => api.navigate('/'), 3000);
      return ['Запись не найдена']
    }
    const { browser, version, os, platform, source, isBot, isDesktop, isMobile, ...data } = (log.userAgent as any)._agent;

    return [
      `
        <a href="/">К журналу</a>
        <h2 style="text-align:center">Информация о событии</h2>
      `,
      {
        type: 'table',
        columns: [
          {
            key: 'param',
            title: 'Параметр',
            type: 'str',
            width: '200px',
          },
          {
            key: 'val',
            title: 'Значение',
            type: 'str',
          }
        ],
        getData: reduceArrayByParams(() =>  [
          {
            param: 'Событие',
            val: log.text
          },
          {
            param: 'Дата и время (когда сервер получил событие)',
            val: moment(log.datetime).format('DD.MM.YYYY HH:mm:ss'),
          },
          {
            param: 'Тип события',
            val: log.type
          },
          {
            param: 'ID пользователя',
            val: log.peerId
          },
          {
            param: 'Имя пользователя',
            val: log.displayName
          },
          {
            param: 'Комната',
            val: log.roomId
          },
        ]
      )
      },
      `
        <h2 style="text-align:center">Информация об устройстве пользвателя</h2>
      `,
      {
        type: 'table',
        columns: [
          {
            key: 'param',
            title: 'Параметр',
            type: 'str',
            width: '200px',
          },
          {
            key: 'val',
            title: 'Значение',
            type: 'str',
          }
        ],
        getData: reduceArrayByParams(() =>  [
            {
              param: 'Устройство',
              val: isBot ? 'Бот' : isDesktop ? 'Десктоп' : isMobile ? 'Мобильное' : 'Не определено'
            },
            {
              param: 'Браузер',
              val: browser,
            },
            {
              param: 'Версия',
              val: version,
            },
            {
              param: 'Операционная система',
              val: os,
            },
            {
              param: 'Платформа',
              val: platform,
            },
            {
              param: 'Источник',
              val: source,
            },
            ...Object.keys(data).map(param => ({
              param,
              val: 
                typeof (data as any)[param] === 'object' ?
                  JSON.stringify((data as any)[param])
                  :
                typeof (data as any)[param] === 'boolean' ?
                  (data as any)[param] ? 'Да' : "Нет"
                  :
                  (data as any)[param]

            }))
          ]
        )
      }
    ]
  },
})
