import { sequlizeQueryByParams } from "../lib/tables/sequlizeQueryByParams";
import { admin } from "./auth-and-connect-admin";
import { Log } from "./log";
import moment from "moment";
import 'moment';
import { reduceArrayByParams } from "../lib/tables/reduceArrayByParams";

moment.locale('ru');

admin.pages.push({
  path: '/',
  title: 'Журнал событий',
  content() {
    return [
      '<h2 style="text-align:center">Отчет по событиям</h2>',
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
        getData: reduceArrayByParams(async () => {
          const [
            success,
            info,
            warning,
            error
          ] = await Promise.all([
            Log.count({ where: { type: 'success' } }),
            Log.count({ where: { type: 'info' } }),
            Log.count({ where: { type: 'warning' } }),
            Log.count({ where: { type: 'error' } }),
          ]);

          const sum = success + info + warning + error;

          return [
            {
              param: 'Успешные события',
              val: `${success} (${((success / sum) * 100).toFixed(2)}%)`
            },
            {
              param: 'Информационные события',
              val: `${info} (${((info / sum) * 100).toFixed(2)}%)`
            },
            {
              param: 'Предупреждения',
              val: `${warning} (${((warning / sum) * 100).toFixed(2)}%)`
            },
            {
              param: 'Ошибки',
              val: `${error} (${((error / sum) * 100).toFixed(2)}%)`
            },
          ]
        })
      },
      '<h2 style="text-align:center">Все события</h2>',
      {
        type: 'table',
        columns: [
          {
            key: 'id',
            title: 'ID',
            type: 'num',
            width: '100px'
          },
          {
            key: 'datetime',
            title: 'Дата и время',
            type: 'date',
            format: 'DD.MM.YYYY hh:mm:ss',
            width: '200px'
          },
          {
            key: 'type',
            title: 'Тип события',
            type: 'enum',
            values: ['info', 'error', 'warning', 'success'],
            width: '200px'
          },
          {
            key: 'text',
            title: 'Событие',
            type: 'str',
          },
          {
            key: 'link',
            title: 'Ссылка',
            type: 'link',
            width: '100px'
          }
        ],
        getData: sequlizeQueryByParams(
          Log,
          [
            'text',
          ],
          (item) => ({
            id: item.id,
            datetime: item.datetime,
            type: item.type,
            text: item.text,
            link: {
              href: '/log/' + item.id,
              label: 'Перейти',
            }
          })
        )
      }
    ]
  },
});
