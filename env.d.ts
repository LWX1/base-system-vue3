/// <reference types="vite/client" />
declare module '*.vue' {
    const component: any
    export default component
}

declare module 'element-plus' {
    export class ElMessage {
      constructor(options: ElMessageOptions);
      static success(message: string): void;
      static warning(message: string): void;
      static info(message: string): void;
      static error(message: string): void;
    }
    export class ElMessageBox {
      static confirm(message: string, title: string, options: any): Promise<any>;
      static alert(message: string, title: string, options: any): Promise<any>;
      static prompt(message: string, title: string, options: any): Promise<any>;
      static msgbox(message: string, title: string, options: any): Promise<any>;
      
    }
    export dayjs {
      export function dayjs(params:any): any;
    }
  }