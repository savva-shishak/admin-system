import { ToastOptions } from "react-toastify";
import { FormType } from "./form";
import { TableType } from "./tables";

export type Promised<T> = T | Promise<T>;

export type User<Data = any> = Data & {
  id: string;
  send(data: any): any;
  on(message: string, listener: (data: string) => any): void
}

export type ComponentsContentType = (
  string
  | (TableType<any> & { type: 'table' })
  | (FormType & { type: 'form' })
);

export type Api = {
  navigate: (href: string) => void;
  notify: (message: string, options?: ToastOptions) => void
}

export type PageType<Client> = {
  readonly path: string,
  readonly title: string | ((params: any, client: Client) => Promised<string>),
  readonly auth?: (params: any, client: Client) => Promised<boolean>,
  content: (params: any, client: Client, api: Api) => Promised<ComponentsContentType[]>,
  menu?: {
    title: string,
    icon?: string,
  }
};

export type MenuType<Client> = {
  path: string,
  icon?: string,
  title: string,
  auth?: (params: any, client: Client) => Promised<boolean>,
};

export * from "./tables";
export * from "./form";