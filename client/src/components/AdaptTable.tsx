import moment from "moment";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { socket } from "../App";
import { Table } from "./table/Table";

export function AdaptTable({ config }: any) {
  const navigate = useNavigate();
  return (
    <Table
      columns={config.columns.map((column: any) => ({
        key: column.key as any,
        title: column.title,
        type: ['anchor', 'password'].includes(column.type) ? 'str' : column.type as any,
        values: column.values,
        render(row: any) {
          if (row[column.key] === null || row[column.key] === undefined) {
            return null;
          }

          if (column.type === 'date') {
            return moment(row[column.key]).format(column.format)
          }

          if (column.type === 'anchor') {
            const { href, label } = row[column.key];

            if (href.startsWith('http')) {
              return <a href={href} target="_blank">{label}</a>
            } else {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(href);
                  }}
                >
                  {label}
                </a>
              );
            }
          }

          if (column.type === 'img') {
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={row[column.key]} alt={column.key} style={{ height: 50, width: 'auto' }} />
                {/* <a href={row[column.key]} target="_blank">
                  <Button variant="light" size="sm">
                    <img src={DownloadIcon} className="icon" />
                  </Button>
                </a> */}
              </div>
            )
          }

          // if (column.type === 'key') {
          //   return (
          //     <div>
          //       <Button variant="light" style={{ marginRight: 10 }} size="sm" onClick={() => navigator.clipboard.writeText(row[column.key])}>
          //         <img src={CopyIcon} className="icon" />
          //       </Button>
          //       {row[column.key].slice(0, 5)}
          //       ...
          //     </div>
          //   )
          // }

          // if (column.type === 'checkbox') {
          //   return (
          //     <AdminCheckbox value={row[column.key]} row={row} actionId={column.onChange} />
          //   );
          // }

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