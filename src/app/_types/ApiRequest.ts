// Record<Keys, Type>はプロパティのキーがKeysであり、プロパティの値がTypeであるオブジェクトの型を作る
export type ApiRequestHeader = Record<string, string | null> | undefined;


type HpptMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface ApiRequestOptions {
  path: string;
  method: HpptMethods;
  body?: any;
  token?: string;
  headers?: ApiRequestHeader;
}