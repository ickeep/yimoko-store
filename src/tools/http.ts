import axios, { AxiosRequestConfig, AxiosRequestTransformer, AxiosResponse } from 'axios';
import { Key } from 'react';

import { getCodeByStatus, IHTTPCode, IHTTPResponse } from './api';
import { getAutoArr } from './tool';

// 根据 Content-Type 自动转换数据 form-data，
export const autoTransformDataType: AxiosRequestTransformer = (data, headers) => {
  if (headers?.['Content-Type'] === 'multipart/form-data' && data && !(data instanceof FormData)) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, values]: [string, any]) => formData.append(key, values));
    return formData;
  }
  return data;
};

// 设置 Content-Type 为 form-data
export const setContentTypeFormData = (config: AxiosRequestConfig) => {
  const newConfig = config;
  !newConfig.headers && (newConfig.headers = {});
  newConfig.headers['Content-Type'] = 'multipart/form-data';
  return newConfig;
};

export const http = axios.create({
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformRequest: [autoTransformDataType, ...getAutoArr(axios.defaults.transformRequest)],
});

// 将 response 处理为统一的 { code, data, message } 格式
export const httpRequest: IHTTPRequest = async (config) => {
  try {
    const response = await http(config);
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

export const httpPostForm: IHTTPPost = (url, data, config) => httpRequest(setContentTypeFormData({ ...config, url, data, method: 'post' }));
export const httpPutForm: IHTTPPost = (url, data, config) => httpRequest(setContentTypeFormData({ ...config, url, data, method: 'put' }));
export const httpPatchForm: IHTTPPost = (url, data, config) => httpRequest(setContentTypeFormData({ ...config, url, data, method: 'patch' }));

// 处理请求返回的数据
export const handleResponse = <T = Record<Key, any>>(response: AxiosResponse<T>): IHTTPResponse<T> => {
  const { data, status, statusText } = response;
  const resData = getResponseData(response);
  return {
    ...response,
    code: resData?.code ?? getCodeByStatus(status),
    msg: resData?.msg ?? statusText,
    data: resData.data ?? data,
  };
};


// 获取 response data
export const getResponseData = (response: AxiosResponse): Record<Key, any> => {
  const { data } = response;
  return (typeof data?.code !== 'undefined' && (typeof data?.msg !== 'undefined' || typeof data?.data !== 'undefined')) ? data : response;
};

export type IHTTPRequest = <R = any, P = any>(config: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IHTTPGet = <R = any, P = any>(url: string, config?: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IHTTPPost = <R = any, P = Record<Key, any>> (url: string, data?: P, config?: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;
