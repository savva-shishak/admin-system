import { reduceForm } from "./reduce-components/form";
import { reduceTable } from "./reduce-components/table";
import { Api, PageType, Promised } from "./types";

export type AdminParams = {
  messageListen: (data: any) => any;
};

type ClientMessage = {
  target: 'load',
  path: string,
  params: any,
} | {
  target: 'action',
  actionId: string,
  respondId: string,
  params: any,
  data: any,
} | {
  target: 'get-paths',
  params: any,
};

export type ClientAction = {
  id: string,
  handler: (params: any) => any,
};

export class Admin<ClientData extends object = any> {
  public readonly pages: PageType<ClientData>[] = [];

  public clients: {}[] = [];

  public createClient(
    getClientData: () => Promised<ClientData>,
    sendToClient: (data: any) => any,
  ) {
    const ths = this;

    let actions: ClientAction[] = [];

    const client =  {
      getClientData,
      sendToClient,
      close() {
        ths.clients = ths.clients.filter((c) => client !== c)
      },
      async emitMessage(message: ClientMessage) {
        const clientData = await getClientData();

        if (message.target === 'action') {
          const action = actions.find((action) => action.id === message.actionId);

          if (action) {
            sendToClient({
              target: 'action',
              action: message.respondId,
              data: await action.handler(message.params)
            })
          } else {
            sendToClient('action not found')
          }
          return;
        }

        const authPages = await Promise.all(
          ths.pages.map(async (page) => ({
            page, 
            auth: !page.auth || await page.auth(message.params, clientData),
          }))
        );

        const pages = authPages
          .filter(({ auth }) => auth)
          .map(({ page }) => page);

        if (message.target === 'get-paths') {
          sendToClient({
            target: 'paths',
            paths: pages.map((page) => ({ path: page.path, menu: page.menu })),
          });

          return;
        }

        if (message.target === 'load') {
          const page = pages.find((page) => page.path === message.path);

          if (!page) {
            return;
          }

          actions = [];

          const api: Api = {
            navigate(href) {
              sendToClient({ target: 'navigate', href });
            },
            notify(message, options) {
              sendToClient({ target: 'notify', message, options });
            }
          }

          sendToClient({
            target: 'page',
            title: typeof page.title === 'function' 
              ? await page.title(message.params, clientData)
              : page.title,
            content: (await page.content(message.params, clientData, api))
              .map((item) => {
                if (typeof item === 'string' || typeof item === 'number') {
                  return { type: 'html', payload: item };
                }
        
                if (item.type === 'table') {
                  return reduceTable(item, (action) => actions.push(action));
                }
        
                if (item.type === 'form') {
                  return reduceForm(item, (action) => actions.push(action));
                }
        
                return {
                  type: 'special',
                  payload: item,
                };
              })
          })
        }
      },
    }

    this.clients.push(client);

    return client;
  }
}