import { admin, PHONES, sequlizeQueryByParams } from "..";
import { Phone } from "../../phones/Phone";

import "./phone";
import { ADMIN_ALL } from "../../../admin/Users";
import { checkbox, input, multiselect, select } from "../../../admin";

admin.pages.push(
  {
    path: '/shop/phones',
    auth: (user) => user.grants.includes(PHONES) || user.grants.includes(ADMIN_ALL),
    title: 'Телефоны',
    async content() {
      return [
        {
          type: 'form',
          title: 'Новый телефон',
          columns: 3,
          inputs: [
            select({
              label: 'Название',
              name: 'name',
              value: '',
              required: true,
              options: [
                'Samsung',
                'IPhone',
                'Nokia',
                'Xiaomi',
                'Galaxy'
              ]
            }),
            input({
              label: 'Модель',
              name: 'model',
              value: '',
              required: true
            }),
            input({
              label: 'Цена',
              name: 'price',
              value: '',
              type: 'number',
              required: true
            }),
            input({
              label: 'Количество',
              name: 'count',
              value: '',
              type: 'number',
              required: true
            }),
            input({
              label: 'Изображение',
              name: 'image',
              value: '',
              type: 'file',
              required: true
            }),
            checkbox({
              label: 'Опубликован',
              name: 'published',
              value: false,
            }),
            multiselect({
              label: 'Комлектация',
              name: 'equipment',
              value: [],
              options: [
                'USB провод',
                'Блок питания',
                'Наушники проводные',
                'Наушники беспроводные',
                'Коробка',
                'Паспорт',
              ]
            })
          ],
          actions: [
            {
              text: 'Добавить',
              async action({ name, price, count, model, image, published, equipment }) {  
                const phone = new Phone();
                phone.name = name;
                phone.model = model;
                phone.price = price;
                phone.count = count;
                phone.image = image;
                phone.published = !!published;
                phone.equipment = equipment;              
                await phone.save();
                return 'reset';
              }
            }
          ]
        },
        {
          type: 'table',
          columns: [
            {
              key: 'link',
              title: 'Перейти',
              type: 'anchor',
              width: '100px',
            },
            {
              key: 'name',
              title: 'Название',
              type: 'select',
              options: [
                'Samsung',
                'IPhone',
                'Nokia',
                'Xiaomi',
                'Galaxy'
              ],
              async onChange({ row, inputValue }) {
                await Phone.update({ name: inputValue }, { where: { id: row.id } });
              },
            },
            {
              key: 'model',
              title: 'Модель',
              type: 'input',
              async onChange({ row, inputValue }) {
                await Phone.update({ model: inputValue }, { where: { id: row.id } });
              }
            },
            {
              key: 'price',
              title: 'Цена',
              type: 'num'
            },
            {
              key: 'count',
              title: 'Количество',
              type: 'num'
            },
            {
              key: 'image',
              title: 'Изображение',
              type: 'img'
            },
            {
              key: 'published',
              title: 'Опубликован',
              type: 'checkbox',
              async onChange({ row, inputValue }) {
                await Phone.update({ published: inputValue }, { where: { id: row.id } });
                return 'ok';
              },
            },
            {
              key: 'equipment',
              title: 'Комплектация',
              type: 'multiselect',
              options: [
                'USB провод',
                'Блок питания',
                'Наушники проводные',
                'Наушники беспроводные',
                'Коробка',
                'Паспорт',
              ],
              async onChange({ row, inputValue }) {
                await Phone.update({ equipment: inputValue }, { where: { id: row.id } });
                return 'ok';
              },
            },
          ],
          getData: sequlizeQueryByParams(
            Phone,
            ['name', 'model'],
            ({ id, name, model, image, price, count, published, equipment }) => ({
              name, model, image, price, count, id, published, equipment,
              link: {
                label: 'Перейти',
                href: '/shop/phones/' + id
              }
            })
          ),
        },
      ];
    }
  },
);
