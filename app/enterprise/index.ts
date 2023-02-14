import { reduceArrayByParams } from "../lib/tables/reduceArrayByParams";
import { admin, users } from "./auth-and-connect-admin";

admin.pages.push({
  path: '/',
  menu: {
    title: 'Главная',
    icon: 'http://localhost:8080/static/home.png'
  },
  title: ({}, client) => `Добро пожаловать, ${client.user.name}!!!`,
  async content({}, client, api) {
    return [
      {
        type: 'table',
        columns: [
          {
            key: 'name',
            title: 'Имя',
            type: 'str',
          },
          {
            key: 'login',
            title: 'Логин',
            type: 'str',
          },
          {
            key: 'avatar',
            title: 'Аватар',
            type: 'img',
          },
        ],
        getData: reduceArrayByParams(() => users)
      },
    ];
  }
});

admin.pages.push({
  path: '/form',
  menu: {title: 'Формочка'},
  title: 'Формочка',
  content(_, __, api) {
    return [
      {
        type: 'form',
        inputs: [
          {
            type: 'str',
            label: 'test',
            name: 'testField',
            value: '',
          }
        ],
        buttons: [
          {
            type: 'primary',
            label: 'Первая кнопка',
            onClick(data: any) {
              api.notify(`Вы написали ${data.testField}, а теперь пиздуйте на другую страницу`, { type: 'info' });
              api.navigate('/')
            },
          }
        ],
      },
    ]
  }
})