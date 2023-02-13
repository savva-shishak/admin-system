import { v4 } from "uuid";
import { ClientAction } from "../Admin";
import { Column, TableType } from "../types";

export function reduceColumn(addAction: (action: ClientAction) => void, column: Column<any>) {
  if (['checkbox', 'input', 'select', 'multiselect'].includes(column.type)) {
    const id = v4();

    addAction({ id, handler: (column as any).onChange.bind(column) });

    return {
      ...column,
      onChange: id,
      options: (column as any).options?.map((option: any) => typeof option === 'string' ? { value: option, text: option } : option)
    };
  }

  return column;
}

export function reduceTable(addAction: (action: ClientAction) => void, table: TableType<any>) {
  return {
    type: 'table',
    columns: table.columns.map((column) => reduceColumn(addAction, column)),
  };
}