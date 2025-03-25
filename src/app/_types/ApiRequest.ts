// Record<Keys, Type>はプロパティのキーがKeysであり、プロパティの値がTypeであるオブジェクトの型を作る
export type ApiRequestHeader = Record<string, string | null> | undefined;


type HpptMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface ApiRequestOptions<T = unknown> {
  path: string;
  method: HpptMethods;
  body?: T;
  token?: string;
  headers?: ApiRequestHeader;
}