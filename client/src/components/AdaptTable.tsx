import { Button, IconButton } from "@material-ui/core";
import moment from "moment";
import { v4 } from "uuid";
import { socket } from "../App";
import { TableCheckbox } from "./table-columns/checkbox";
import { Table } from "./table/Table";
import { FileCopy } from '@material-ui/icons';
import { toast } from "react-toastify";

export function AdaptTable({ config }: any) {
  return (
    <Table
      columns={config.columns.map((column: any) => ({
        key: column.key as any,
        title: column.title,
        type: ['anchor', 'password'].includes(column.type) ? 'str' : column.type as any,
        values: column.values,
        width: column.width,
        render(row: any) {
          if (row[column.key] === null || row[column.key] === undefined) {
            return null;
          }

          if (column.type === 'date') {
            return moment(row[column.key]).format(column.format)
          }

          if (column.type === 'link') {
            const { href, label, target } = row[column.key];

            return <a href={href} target={target}>{label}</a>
          }

          if (column.type === 'img') {
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={row[column.key]} alt={column.key} style={{ height: 50, width: 'auto' }} />
                <a href={row[column.key]} target="_blank">
                  <Button size="small">
                    Скачать
                  </Button>
                </a>
              </div>
            )
          }

          if (column.type === 'key') {
            return (
              <div>
                <IconButton
                  style={{ marginRight: 10 }}
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(row[column.key]);
                    toast.info('Скопировано')
                  }}
                >
                  <FileCopy />
                </IconButton>
                {row[column.key].slice(0, 5)}
                ...
              </div>
            )
          }

          if (column.type === 'check') {
            return (
              <TableCheckbox value={row[column.key]} row={row} actionId={column.onChange} />
            );
          }

          // if (column.type === 'select') {
          //   return (
          //     <AdminSelect options={column.options} value={row[column.key]} row={row} actionId={column.onChange} />
          //   );
          // }

          // if (column.type === 'multiselect') {
          //   return (
          //     <AdminMultiSelect options={column.options} value={row[column.key]} row={row} actionId={column.onChange} />
          //   );
          // }

          // if (column.type === 'input') {
          //   return (
          //     <AdminInput value={row[column.key]} row={row} actionId={column.onChange} />
          //   );
          // }

          if (column.type === 'html') {
            return <div dangerouslySetInnerHTML={{ __html: row[column.key] }} />;
          }

          return row[column.key];
        }
      }))}
      getData={(params) => {
        return new Promise((res) => {
          const id = v4();
          socket.emit('admin-message', { target: 'action', actionId: config.getData, respondId: id, params })
          
          socket.on('admin-message', onAction)

          function onAction(data: any) {
            if (data.target === 'action' && data.action === id) {
              socket.off('admin-message', onAction);
              res(data.data);
            }
          }
        });
      }}
    />
  );
}