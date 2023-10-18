/* eslint-disable testing-library/await-async-utils */
// @ts-ignore
import moxios from 'moxios';

import { IHTTPCode, judgeIsSuccess } from './api';
import { getResponseData, handleResponse, http, httpDelete, httpGet, httpHead, httpPatch, httpPost, httpPut, httpRequest } from './http';

describe('getResponseData', () => {
  it('should return the data object if it has a code property and either a msg or data property', () => {
    const response: any = {
      data: {
        code: 200,
        msg: 'Success',
        data: { foo: 'bar' },
      },
    };
    const result = getResponseData(response);
    expect(result).toEqual(response.data);
  });

  it('should return the entire response object if the data object does not have a code property', () => {
    const response: any = {
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: {},
    };
    const result = getResponseData(response);
    expect(result).toEqual(response);
  });
});
describe('handleResponse', () => {
  it('should return the expected IHTTPResponse object when given a successful AxiosResponse object with a code property in the response data', () => {
    const response: any = {
      data: {
        code: 200,
        data: { foo: 'bar' },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const result = handleResponse(response);
    expect(result).toEqual({
      ...response,
      code: 200,
      msg: 'OK',
      data: { foo: 'bar' },
    });
  });

  it('should return the expected IHTTPResponse object when given a successful AxiosResponse object without a code property in the response data', () => {
    const response: any = {
      data: { foo: 'bar' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const result = handleResponse(response);
    expect(result).toEqual({
      ...response,
      code: 0,
      msg: 'OK',
      data: { foo: 'bar' },
    });
  });

  it('should return the expected IHTTPResponse object when given an unsuccessful AxiosResponse object without a code property in the response data', () => {
    const response: any = {
      data: { foo: 'bar' },
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: {},
    };
    const result = handleResponse(response);
    expect(result).toEqual({
      ...response,
      code: 404,
      msg: 'Not Found',
      data: { foo: 'bar' },
    });
  });

  it('should return the expected IHTTPResponse object when given an unsuccessful AxiosResponse object with a code property in the response data', () => {
    const response: any = {
      data: {
        code: 400,
        msg: 'Bad Request',
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {},
    };
    const result = handleResponse(response);
    expect(result).toEqual({
      ...response,
      code: 400,
      msg: 'Bad Request',
    });
  });
});

describe('http', () => {
  expect(http).toBeDefined();
});

describe('httpRequest', () => {
  beforeEach(() => {
    moxios.install(http);
  });

  afterEach(() => {
    moxios.uninstall(http);
  });

  it('should return the response data when the request is successful', (done) => {
    moxios.stubRequest('/successful', {
      status: 200,
      statusText: 'hello',
      response: { data: 'data' },
    });

    const onFulfilled = jest.fn();
    httpRequest({ url: '/successful' }).then(onFulfilled);

    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeTruthy();
      expect(res.msg).toBe('hello');
      expect(res.data).toEqual({ data: 'data' });
      done();
    });
  });

  it('should return the response data when the request is code err', (done) => {
    moxios.stubRequest('/err', {
      status: 200,
      statusText: 'hello',
      response: { code: 1, msg: 'error', data: 'data' },
    });

    const onFulfilled = jest.fn();
    httpRequest({ url: '/err' }).then(onFulfilled);

    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeFalsy();
      expect(res.msg).toBe('error');
      expect(res.data).toBe('data');
      done();
    });
  });

  // 出错
  it('should return the response data when the request is error', (done) => {
    moxios.stubRequest('/error', {
      status: 500,
      statusText: 'error',
    });

    const onFulfilled = jest.fn();
    httpRequest({ url: '/error' }).then(onFulfilled);

    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeFalsy();
      expect(res.msg).toBe('error');
      done();
    });
  });

  it('err 并且没有 response 如跨域', (done) => {
    moxios.stubRequest('/cross');
    const onFulfilled = jest.fn();
    httpRequest({ url: '/cross' }).then(onFulfilled);
    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(res.code).toBe(IHTTPCode.networkError);
      done();
    });
  });

  it('httpGet', (done) => {
    moxios.stubRequest('/successful', {
      status: 200,
      statusText: 'hello',
      response: { data: 'data' },
    });
    const onFulfilled = jest.fn();
    httpGet('/successful').then(onFulfilled);
    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeTruthy();
      expect(res.msg).toBe('hello');
      expect(res.data).toEqual({ data: 'data' });
      expect(res.config.method).toBe('get');
      done();
    });
  });

  it('httpDelete', (done) => {
    moxios.stubRequest('/successful', {
      status: 200,
      statusText: 'hello',
      response: { data: 'data' },
    });
    const onFulfilled = jest.fn();
    httpDelete('/successful').then(onFulfilled);
    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeTruthy();
      expect(res.msg).toBe('hello');
      expect(res.data).toEqual({ data: 'data' });
      expect(res.config.method).toBe('delete');
      done();
    });
  });

  it('httpHead', (done) => {
    moxios.stubRequest('/successful', {
      status: 200,
      statusText: 'hello',
      response: { data: 'data' },
    });
    const onFulfilled = jest.fn();
    httpHead('/successful').then(onFulfilled);
    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeTruthy();
      expect(res.msg).toBe('hello');
      expect(res.data).toEqual({ data: 'data' });
      expect(res.config.method).toBe('head');
      done();
    });
  });

  it('httpPost', (done) => {
    moxios.stubRequest('/successful', {
      status: 200,
      statusText: 'hello',
      response: { data: 'data' },
    });
    const onFulfilled = jest.fn();
    httpPost('/successful').then(onFulfilled);
    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeTruthy();
      expect(res.msg).toBe('hello');
      expect(res.data).toEqual({ data: 'data' });
      expect(res.config.method).toBe('post');
      done();
    });
  });

  it('httpPut', (done) => {
    moxios.stubRequest('/successful', {
      status: 200,
      statusText: 'hello',
      response: { data: 'data' },
    });
    const onFulfilled = jest.fn();
    httpPut('/successful').then(onFulfilled);
    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeTruthy();
      expect(res.msg).toBe('hello');
      expect(res.data).toEqual({ data: 'data' });
      expect(res.config.method).toBe('put');
      done();
    });
  });
  it('httpPatch', (done) => {
    moxios.stubRequest('/successful', {
      status: 200,
      statusText: 'hello',
      response: { data: 'data' },
    });
    const onFulfilled = jest.fn();
    httpPatch('/successful').then(onFulfilled);
    moxios.wait(() => {
      expect(onFulfilled).toHaveBeenCalled();
      const res = onFulfilled.mock.calls[0][0];
      expect(judgeIsSuccess(res)).toBeTruthy();
      expect(res.msg).toBe('hello');
      expect(res.data).toEqual({ data: 'data' });
      expect(res.config.method).toBe('patch');
      done();
    });
  });
});
