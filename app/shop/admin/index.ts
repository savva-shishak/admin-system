import { admin, sequlizeQueryByParams, reduceArrayByParams, protect } from "../../admin";
import { ADMIN_ALL } from "../../admin/Users";
import { mainRouter } from "../../context";
import "./phones";

export const PHONES = 'PHONES';

admin.menu.push({
  path: '/',
  auth: ({ grants }) => grants.includes(PHONES) || grants.includes(ADMIN_ALL),
  title: 'Главная',
  icon: '',
});
admin.menu.push({
  path: '/shop/phones',
  auth: ({ grants }) => grants.includes(PHONES) || grants.includes(ADMIN_ALL),
  title: 'Телефоны',
  icon: '',
});

admin.pages.push({
  path: '/',
  title: 'Добро пожаловать',
  async content(_, user) {
    return [
      `<h1 style="text-align: center">Добро пожаловать, ${user.name}!!!</h1>`
    ];
  }
});

admin.pages.push({
  path: '/test',
  title: 'Тестовая страница',
  content({ name }, user) {
    return [
      `Параметр name = ${name};`
    ];
  },
})

export {
  admin,
  sequlizeQueryByParams,
  reduceArrayByParams,
  mainRouter as router,
  protect
}