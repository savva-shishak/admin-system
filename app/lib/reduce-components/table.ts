import { v4 } from "uuid";
import { ClientAction } from "../Admin";
import { TableType } from "../types";

export function reduceTable(table: TableType<any>, addAction: (action: ClientAction) => void) {
  const getDataid = v4();

  addAction({ id: getDataid, handler: table.getData });

  return {
    type: 'table',
    config: {
      ...table,
      columns: table.columns.map((column) => {

        if (['checkbox', 'input', 'select', 'multiselect'].includes(column.type)) {
          const id = v4();
          addAction({ id, handler: (column as any).onChange.bind(column) })
          return {
            ...column,
            onChange: id,
          };
        }

        return {
          ...column,
        };
      }),
      getData: getDataid,
    },
  };
}