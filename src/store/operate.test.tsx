import { createForm } from '@formily/core';

import { IStoreHTTPRequest } from './base';

import { OperateStore } from './operate';

describe('OperateStore', () => {
  test('df', () => {
    const store = new OperateStore();
    expect(store.isFilterEmptyAtRun).toBeFalsy();
    expect(store.isBindRouter).toBeFalsy();
    expect(store.isRunNow).toBeFalsy();
    expect(store.form).toBeUndefined();
    expect(store.notifier).toBeUndefined();
    expect(store.runBefore).toEqual({ verify: true });
    expect(store.runAfter.notify).toBeTruthy();

    const form = createForm();
    const store1 = new OperateStore({ form });
    expect(store1.form).toEqual(form);
  });

  test('runBefore true not form', async () => {
    const values = { name: '' };
    const apiRes = { code: 0, msg: 'ok', data: { name: '123' } };
    const api = () => new Promise(resolve => resolve(apiRes));

    const store = new OperateStore({ api, defaultValues: values, runBefore: { verify: true } });
    expect(store.runBefore.verify).toBeTruthy();
    const res = await store.runAPI();
    expect(res).toEqual(apiRes);

    const form = createForm({ values: store.values, validateFirst: true });
    form.createField({ name: 'name', required: true });
    store.form = form;
    const res2 = await store.runAPI();
    expect(res2?.code).toBeUndefined();

    store.runBefore.verify = false;
    const res3 = await store.runAPI();
    expect(res3).toEqual(apiRes);

    store.runBefore.verify = true;

    form.setValues({ name: '123' });
    const res4 = await store.runAPI();
    expect(res4).toEqual(apiRes);
  });

  test('afterNotify', async () => {
    const res = { code: 0, msg: 'ok', data: { name: '123' } };
    const notifier = jest.fn();
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const store = new OperateStore({ notifier, apiExecutor, api: { url: '' } });
    await store.runAPI();
    expect(notifier).toBeCalledWith('success', res.msg);

    res.code = 1;
    await store.runAPI();
    expect(notifier).toBeCalledWith('error', res.msg);
    expect(notifier).toBeCalledTimes(2);

    store.runAfter.notify = false;
    await store.runAPI();
    expect(notifier).toBeCalledTimes(2);

    store.runAfter.notifyOnFail = 'fail';
    await store.runAPI();
    expect(notifier).toBeCalledWith('error', 'fail');

    res.code = 0;
    store.runAfter.notifyOnSuccess = 'success';
    await store.runAPI();
    expect(notifier).toBeCalledWith('success', 'success');

    store.runAfter.notifyOnSuccess = true;
    res.msg = '';
    await store.runAPI();
    expect(notifier).toBeCalledWith('success', '成功了');

    store.runAfter.notifyOnFail = true;
    res.code = 1;
    await store.runAPI();
    expect(notifier).toBeCalledWith('error', '出错了');
  });

  test('runAfter', async () => {
    const res = { code: 0, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const store = new OperateStore({ apiExecutor, api: { url: '' } });
    expect(store.runAfter.run).toBeUndefined();
    expect(store.runAfter.runOnFail).toBeUndefined();
    expect(store.runAfter.runOnSuccess).toBeUndefined();

    const run = jest.fn();
    const runOnFail = jest.fn();
    const runOnSuccess = jest.fn();
    store.runAfter.run = run;
    store.runAfter.runOnFail = runOnFail;
    store.runAfter.runOnSuccess = runOnSuccess;

    await store.runAPI();
    expect(run).toBeCalled();
    expect(runOnFail).not.toBeCalled();
    expect(runOnSuccess).toBeCalled();
    expect(run).toBeCalledWith(res, store);
    expect(runOnSuccess).toBeCalledWith(res, store);

    res.code = 1;
    await store.runAPI();
    expect(run).toBeCalledTimes(2);
    expect(runOnFail).toBeCalled();
    expect(runOnSuccess).toBeCalledTimes(1);
    expect(runOnFail).toBeCalledWith(res, store);
    expect(run).toBeCalledWith(res, store);
  });

  test('runAfter resetValues df success', async () => {
    const res = { code: 0, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues });
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual(defaultValues);
  });

  test('runAfter resetValues df fail', async () => {
    const res = { code: 1, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues });
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual({ name: '123' });
  });

  test('runAfter resetValues true success', async () => {
    const res = { code: 0, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues, runAfter: { resetValues: true } });
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual(defaultValues);
  });

  test('runAfter resetValues true fail', async () => {
    const res = { code: 1, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues, runAfter: { resetValues: true } });
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual(defaultValues);
  });


  test('runAfter resetValues success success', async () => {
    const res = { code: 0, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues, runAfter: { resetValues: 'success' } });
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual(defaultValues);
  });

  test('runAfter resetValues success fail', async () => {
    const res = { code: 1, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues, runAfter: { resetValues: 'success' } });
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual({ name: '123' });
  });

  test('runAfter resetValues fail success', async () => {
    const res = { code: 0, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues, runAfter: { resetValues: 'fail' } });
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual({ name: '123' });
  });

  test('runAfter resetValues fail fail', async () => {
    const res = { code: 1, msg: 'ok', data: { name: '123' } };
    const apiExecutor: IStoreHTTPRequest = () => new Promise(resolve => setTimeout(() => resolve(res), 10));
    const defaultValues = { name: '' };
    const store = new OperateStore({ api: apiExecutor, defaultValues, runAfter: { resetValues: 'fail' } });
    const from = createForm<any>({ values: store.values });
    store.form = from;
    store.setValuesByField('name', '123');
    expect(store.values.name).toEqual('123');
    await store.runAPI();
    expect(store.values).toEqual(defaultValues);
    expect(store?.form?.values).toEqual(defaultValues);
  });
});
