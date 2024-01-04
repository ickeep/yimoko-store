import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Key } from 'react';

import { getCodeByStatus, IHTTPCode, IHTTPResponse } from './api';

export const http = axios.create();

// 将 response 处理为统一的 { code, data, msg } 格式
export const httpRequest: IHTTPRequest = async (config) => {
  try {
    const { method, data, ...rest } = config;
    let curData = data as Record<Key, any>;
    // post data 为空时 会导致 content-type 为 null
    if (method?.toLowerCase() === 'post') {
      curData = data ?? {};
    }
    const response = await http({ method, data: curData, ...rest });
    return handleResponse(response);
  } catch (e: any) {
    const { response, ...args } = e;
    if (!response) {
      return handleResponse({
        ...args,
        status: IHTTPCode.networkError,
        statusText: e?.message ?? '网络出错',
      });
    }
    return handleResponse(response);
  }
};

export const httpGet: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'get' });
export const httpDelete: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'delete' });
export const httpHead: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'head' });
export const httpOptions: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'options' });

export const httpPost: IHTTPPost = (url, data, config) => httpRequest({ ...config, url, data, method: 'post' });
export const httpPut: IHTTPPost = (url, data, config) => httpRequest({ ...config, url, data, method: 'put' });
export const httpPatch: IHTTPPost = (url, data, config) => httpRequest({ ...config, url, data, method: 'patch' });

// 处理请求返回的数据
export const handleResponse = <T = Record<Key, any>>(response: AxiosResponse<T>): IHTTPResponse<T> => {
  const { status, statusText } = response;
  const resData = getResponseData(response);
  return {
    ...response,
    ...resData,
    code: typeof resData?.code === 'number' ? resData?.code : getCodeByStatus(status),
    msg: resData?.msg ?? resData?.message ?? statusText,
  };
};


// 获取 response data 适配 { code, msg, data } 格式 或者直接返回 response
export const getResponseData = (response: AxiosResponse): Record<Key, any> => {
  const { data } = response;
  return (typeof data?.code !== 'undefined' && (typeof data?.msg !== 'undefined' || typeof data?.message !== 'undefined' || typeof data?.data !== 'undefined')) ? data : response;
};

export type IHTTPRequest = <R = any, P = any>(config: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IHTTPGet = <R = any, P = any>(url: string, config?: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IHTTPPost = <R = any, P = Record<Key, any>> (url: string, data?: P, config?: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;
