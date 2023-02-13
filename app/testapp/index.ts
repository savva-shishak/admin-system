import { admin } from "./admin";

admin.pages.push({
  path: '/',
  menu: {
    title: 'Главная',
    icon: 'http://localhost:8080/static/home.png'
  },
  title: ({}, client) => `Добро пожаловать, ${client.user.name}!!!`,
  async content() {
    return [
      '<h1>Добро пожаловать!!!</h1>'
    ];
  }
});

console.log('test');
