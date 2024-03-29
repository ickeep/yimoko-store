import { createForm } from '@formily/core';

import { BaseStore, IStoreHTTPRequest } from './base';
import { IFieldsConfig } from './utils/field';

describe('BaseStore', () => {
  const defaultValues = { id: 1, name: '', type: 't1' };
  const store = new BaseStore({ defaultValues, api: { url: '' } });

  test('df', () => {
    const dfStore = new BaseStore();
    expect(dfStore.isFilterEmptyAtRun).toBeFalsy();
    expect(dfStore.isBindRouter).toBeFalsy();
    expect(dfStore.isRunNow).toBeFalsy();
    expect(dfStore.dictConfig).toEqual([]);
    expect(dfStore.fieldsConfig).toEqual({});
  });

  test('init run', () => {
    const res = { code: 0, msg: '', data: '' };
    const fn = jest.fn(async () => res);
    new BaseStore({ api: fn });
    expect(fn.mock.calls.length).toBe(0);
    new BaseStore({ api: fn, isRunNow: true });
    expect(fn.mock.calls.length).toBe(1);
    new BaseStore({ api: fn, isRunNow: false });
    expect(fn.mock.calls.length).toBe(1);
    new BaseStore({ api: fn, isRunNow: true, isBindRouter: true });
    expect(fn.mock.calls.length).toBe(1);
    new BaseStore({ api: fn, isRunNow: true, isBindRouter: false });
    expect(fn.mock.calls.length).toBe(2);
    new BaseStore({ api: fn, isRunNow: false, isBindRouter: true });
    expect(fn.mock.calls.length).toBe(2);
    new BaseStore({ api: fn, isRunNow: false, isBindRouter: false });
    expect(fn.mock.calls.length).toBe(2);
    new BaseStore({ api: fn, isBindRouter: true });
    expect(fn.mock.calls.length).toBe(2);
    new BaseStore({ api: fn, isBindRouter: false });
    expect(fn.mock.calls.length).toBe(2);
  });

  test('dictConfig', () => {
    expect(store.dictConfig).toEqual([]);
    const dictConfig = [{ field: 'type', data: [] }];
    const hasDictConfigStore = new BaseStore({ defaultValues, api: { url: '' }, dictConfig });
    expect(hasDictConfigStore.dictConfig).toEqual(dictConfig);
  });

  test('fieldsConfig', () => {
    expect(store.fieldsConfig).toEqual({});
    const fieldsConfig = { type: { type: 'string' } };
    const hasFieldsConfigStore = new BaseStore({ defaultValues, api: { url: '' }, fieldsConfig });
    expect(hasFieldsConfigStore.fieldsConfig).toEqual(fieldsConfig);
  });

  test('schemaDefinitions', () => {
    const fieldsConfig: IFieldsConfig = {
      str: { tooltip: 'str tip' },
      strFormItem: { tooltip: 'str tip', 'x-decorator': 'FormItem' },
      strFormItem2: { tooltip: 'str tip', 'x-decorator': 'FormItem', 'x-decorator-props': { tooltip: '' } },
      objFormItem: { tooltip: { title: 'xxx' }, 'x-decorator': 'FormItem' },
      objFormItem2: { tooltip: { title: 'xxx' }, 'x-decorator': 'FormItem', 'x-decorator-props': { tooltip: {} } },
    };
    const store = new BaseStore({ defaultValues, api: { url: '' }, fieldsConfig });
    expect(store.schemaDefinitions.str).toEqual({});
    expect(store.schemaDefinitions.strFormItem['x-decorator-props']).toEqual({ tooltip: 'str tip' });
    expect(store.schemaDefinitions.strFormItem2['x-decorator-props']).toEqual({ tooltip: '' });
    expect(store.schemaDefinitions.objFormItem['x-decorator-props']).toEqual({ tooltip: { title: 'xxx' } });
    expect(store.schemaDefinitions.objFormItem2['x-decorator-props']).toEqual({ tooltip: {} });
  });

  test('defaultValues', () => {
    expect(store.defaultValues).toEqual(defaultValues);
    expect(store.defaultValues !== defaultValues).toBeFalsy();
    expect(store.getDefaultValues()).toEqual(defaultValues);
    expect(store.getDefaultValues() !== defaultValues).toBeTruthy();
  });

  test('values', () => {
    expect(store.values).toEqual(defaultValues);
    const values = { value: 'val' };
    const hasValueStore = new BaseStore({ defaultValues: values, api: { url: '' } });
    expect(hasValueStore.values).toEqual(values);
  });

  test('setValues', () => {
    store.setValues({ name: 'name' });
    expect(store.values).toEqual({ id: 1, name: 'name', type: 't1' });
  });

  test('resetValues', () => {
    store.resetValues();
    expect(store.values).toEqual(defaultValues);
  });

  test('resetValues ant form', () => {
    const values = { a: 'a', b: { b: 'b' }, c: { c: { c: 'c' } } };
    const store = new BaseStore({ defaultValues: values });
    const form = createForm({ values: store.values });
    store.form = form;

    store.setValuesByField('a', 'aa');
    store.setValuesByField('b', { b: 'bb' });
    store.setValuesByField('c', { c: { c: 'cc' } });
    expect(form.values).toEqual({ a: 'aa', b: { b: 'bb' }, c: { c: { c: 'cc' } } });

    store.resetValues();
    expect(form.values).toEqual(values);

    store.setValuesByField('a', 'aa');
    expect(form.values.a).toBe('aa');

    form.setValuesIn('a', 'aaa');
    expect(store.values.a).toBe('aaa');
    expect(store.values).toBe(form.values);
  });


  test('setValuesByField', () => {
    store.setValuesByField('name', 'name');
    expect(store.values).toEqual({ id: 1, name: 'name', type: 't1' });
  });

  test('resetValuesByFields', () => {
    store.resetValuesByFields(['name']);
    expect(store.values).toEqual(defaultValues);
    store.setValues({ id: 2, name: 'name', type: 't2' });
    store.resetValuesByFields(['name', 'type']);
    expect(store.values).toEqual({ id: 2, name: '', type: 't1' });
  });

  test('setValuesByRouter', () => {
    store.fieldsConfig = { id: { type: 'number' } };
    store.setValuesByRouter('?name=name&xxx=xxx&id=2');
    expect(store.values).toEqual({ id: 2, name: 'name', type: 't1' });

    store.setValuesByRouter({ name: 'name1', id: '3' });
    expect(store.values).toEqual({ id: 3, name: 'name1', type: 't1' });

    store.setValuesByRouter({ id: 4 });
    expect(store.values).toEqual({ id: 4, name: '', type: 't1' });

    store.setValuesByRouter({ name: 'name2' }, {}, 'part');
    expect(store.values).toEqual({ id: 4, name: 'name2', type: 't1' });

    store.setValuesByRouter('', { name: 'name2' });
    expect(store.values).toEqual({ id: 1, name: 'name2', type: 't1' });

    store.setValuesByRouter('?name=name&xxx=xxx&id=2');
  });

  test('getURLSearch', () => {
    expect(store.getURLSearch()).toBe('id=2&name=name');
    store.setValues({ type: 't2' });
    expect(store.getURLSearch()).toBe('id=2&name=name&type=t2');
    store.setValues({ id: 1, type: 't1' });
    expect(store.getURLSearch()).toBe('name=name');

    // @ts-ignore
    store.setValues({ name: [] });
    expect(store.getURLSearch()).toBe('');

    store.setValues({ type: '' });
    expect(store.getURLSearch()).toBe('type=');

    store.setValues({ name: '', type: 't1' });
    expect(store.getURLSearch()).toBe('');
  });

  test('getAPIParams', () => {
    expect(store.getAPIParams()).toEqual({ id: 1, type: 't1', name: '' });
    store.isFilterEmptyAtRun = true;
    expect(store.getAPIParams()).toEqual({ id: 1, type: 't1' });
    store.isFilterEmptyAtRun = true;
    store.setValuesByField('obj', {});
    store.setValuesByField('arr', []);
    expect(store.values).toEqual({ ...defaultValues, obj: {}, arr: [] });
    expect(store.getAPIParams()).toEqual({ id: 1, type: 't1' });
  });

  test('apiExecutor', () => {
    expect(store.apiExecutor).toBeUndefined();
    const apiExecutor: IStoreHTTPRequest = async () => ({ msg: '', code: 0, data: {} });
    const hasApiExecutorStore = new BaseStore({ defaultValues, api: { url: '' }, apiExecutor });
    expect(hasApiExecutorStore.apiExecutor).toBe(apiExecutor);
  });

  test('api', async () => {
    expect(store.api).toEqual({ url: '' });
    const api = async (p: any) => ({ msg: '', code: 0, data: p });;
    const hasApiStore = new BaseStore({ defaultValues, api, isFilterEmptyAtRun: true });
    expect(hasApiStore.api).toEqual(api);
    const res = { msg: '', code: 0, data: { id: 1, type: 't1' } };
    expect(await hasApiStore.runAPI()).toEqual(res);;
    expect(hasApiStore.response).toEqual(res);

    expect((await hasApiStore.runAPIByField('name', 'n1'))?.data.name).toBe('n1');
    expect(hasApiStore.response?.data.name).toBe('n1');

    expect((await hasApiStore.runAPIByValues({ name: 'n2' }))?.data.name).toBe('n2');
    expect(hasApiStore.response?.data.name).toBe('n2');

    expect((await hasApiStore.runAPIDataBySearch('name=n3'))?.data.name).toBe('n3');
    expect(hasApiStore.response?.data.name).toBe('n3');
  });

  test('lastFetchID', async () => {
    jest.useFakeTimers();
    const apiExecutor: IStoreHTTPRequest = ({ time = 100 }) => new Promise(resolve => setTimeout(() => resolve({ msg: '', code: 0, data: time }), time));
    const hasApiExecutorStore = new BaseStore({ defaultValues: { time: 100 }, api: { url: '' }, apiExecutor });
    jest.useFakeTimers();
    hasApiExecutorStore.runAPIByField('time', 200);
    hasApiExecutorStore.runAPIByField('time', 100);

    jest.advanceTimersByTime(100);
    await jest.runAllTimers();
    expect(hasApiExecutorStore.response.data).toBe(100);
  });

  test('transform reqParams', () => {
    const reqParamsFn = jest.fn((p: any) => ({ ...p, name: 'n1' }));
    const defaultValues = { id: 1, name: 'name', type: 't1' };
    const baseStore = new BaseStore({ defaultValues });
    expect(baseStore.transform).toEqual({});
    expect(baseStore.getAPIParams()).toEqual(defaultValues);
    baseStore.transform.reqParams = reqParamsFn;
    expect(baseStore.getAPIParams()).toEqual({ id: 1, type: 't1', name: 'n1' });
    expect(reqParamsFn).toBeCalledTimes(1);
    expect(reqParamsFn).toBeCalledWith(defaultValues, baseStore);
    baseStore.transform.reqParams = { type: 'omit', keys: ['id', 'name'] };
    expect(baseStore.getAPIParams()).toEqual({ type: 't1' });
  });

  test('transform resData', async () => {
    const resDataFn = jest.fn((p: any) => ({ ...p, name: 'n1' }));
    const res = { id: 1, name: 'name', type: 't1' };
    const api = async () => ({ msg: '', code: 0, data: res });;
    const baseStore = new BaseStore({ api });
    expect(baseStore.transform).toEqual({});
    baseStore.transform.resData = resDataFn;
    expect((await baseStore.runAPI())?.data).toEqual({ ...res, name: 'n1' });
    expect(resDataFn).toBeCalledTimes(1);
    expect(resDataFn).toBeCalledWith(res, baseStore);
    baseStore.transform.resData = { type: 'omit', keys: ['id', 'name'] };
    expect((await baseStore.runAPI())?.data).toEqual({ type: 't1' });
  });
});

