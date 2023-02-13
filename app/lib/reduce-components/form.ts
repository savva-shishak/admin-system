import { v4 } from "uuid";
import { ClientAction } from "../Admin";
import { FormType } from "../types";

export function reduceForm(form: FormType, addAction: (action: ClientAction) => void) {
  return {
    type: 'form',
    config: {
      ...form,
      buttons: form.buttons.map((btn) => {
        const id = v4();

        const { onClick: handler, type, label } = btn;

        addAction({ id, handler });

        return {
          handler: id,
          type,
          label
        }
      }),
    },
  };
}