import { admin } from "..";
import { checkbox, input, multiselect, select } from "../../../admin";
import { Phone } from "../../phones/Phone";

admin.pages.push(
  {
    path: '/shop/phones/:id',
    title: ({ id }) => Phone.findOne({ where: { id } }).then((phone: any) => phone? `Телефон ID ${phone.id}` : 'Телефон'),
    async content({ id }) {
      const phone = await Phone.findOne(({ where: { id } }));

      if (!phone) {
        return ['<h4 style="text-align: center">Телефон не найден</h4>'];
      }

      return [
        {
          type: 'form',
          title: phone.name + ' ' + phone.model,
          img: phone.image,
          columns: 3,
          inputs: [
            select({
              label: 'Название',
              name: 'name',
              value: phone?.name || '',
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
              value: phone?.model || '',
              required: true
            }),
            input({
              label: 'Цена',
              name: 'price',
              value: phone?.price || '',
              type: 'number',
              required: true
            }),
            input({
              label: 'Количество',
              name: 'count',
              value: phone?.count || '',
              type: 'number',
              required: true
            }),
            input({
              label: 'Изображение',
              name: 'image',
              value: phone?.image || '',
              type: 'file',
              required: true
            }),
            checkbox({
              label: 'Опубликован',
              name: 'published',
              value: !!phone?.published,
            }),
            multiselect({
              label: 'Комлектация',
              name: 'equipment',
              value: phone?.equipment || [],
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
              text: 'На главную',
              type: 'light',
              action: () => '/shop/phones'
            },
            {
              text: 'Сохранить',
              async action({ name, model, price, count, image, published, equipment }) {
                phone.name = name;
                phone.model = model;
                phone.price = price;
                phone.count = count;
                phone.image = image;
                phone.published = !!published;
                phone.equipment = equipment;
                await phone.save();

                return '/shop/phones';
              } 
            },
            {
              text: 'Удалить',
              type: 'danger',
              async action() {
                await phone.destroy();

                return '/shop/phones';
              }
            }
          ],
        }
      ];
    }
  }
);
