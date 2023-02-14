import { reduceArrayByParams } from "../lib/tables/reduceArrayByParams";
import { InputForm } from "../lib/types";
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
          },
          {
            type: 'str',
            label: 'test',
            name: 'testField',
            value: '',
          },
          {
            type: 'range',
            label: 'test',
            name: 'testField3',
            value: '',
            step: 5,
          },
          {
            type: 'num',
            label: 'test',
            name: 'testField4',
            value: '',
            mask: '+#(###) ###-##-##'
          },
          {
            type: 'file',
            label: 'test',
            name: 'testField5',
            value: '',
            accept: 'image/*',
          },
          {
            type: 'daterange',
            label: 'test',
            name: 'testFielddate',
            value: [null, null],
          },
          {
            type: 'select',
            label: 'test',
            name: 'testField',
            value: null,
            values: [
              'option1',
              'option2',
              'option3',
            ],
          },
          {
            type: 'multiselect',
            label: 'test',
            name: 'testField8',
            value: ['option1'],
            values: [
              'option1',
              'option2',
              'option3',
            ],
          },
          {
            type: 'check',
            label: 'test',
            name: 'testField9',
            value: true,
          },
          {
            type: 'switch',
            label: 'test',
            name: 'testField9',
            value: false,
          },
        ] as InputForm[],
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