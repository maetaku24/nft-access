import { ApiRequestOptions } from '../_types/ApiRequest';

const apiRequest = async <ResponseData>({
  path,
  method,
  body,
  token,
  headers,
}: ApiRequestOptions): Promise<ResponseData> => {
  const res = await fetch(`/api/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'APIリクエストに失敗しました');
  }

  return res.json();
};

export const getRequest = <ResponseData>(path: string, token?: string) =>
  apiRequest<ResponseData>({ path, method: 'GET', token });

export const postRequest = <RequestData, ResponseData>(path: string, body: RequestData, token?: string) =>
  apiRequest<ResponseData>({ path, method: 'POST', body, token });

export const putRequest = <RequestData, ResponseData>(path: string, body: RequestData, token?: string) =>
  apiRequest<ResponseData>({ path, method: 'PUT', body, token });

export const deleteRequest = <ResponseData>(path: string, token?: string) =>
  apiRequest<ResponseData>({ path, method: 'DELETE', token });
