import { act, render } from '@testing-library/react';

import React from 'react';

import { BaseStore } from '../store/base';
import { IHTTPResponse } from '../tools/api';

import { StoreDict, updateValueByDict } from './store-dict';

describe('updateValueByDict', () => {
  test('isUpdateValue', () => {
    const store = new BaseStore({ defaultValues: { a: 'a' }, api: {} });
    const dict = [{ value: 'a1', label: 'a1' }];
    expect(store.values.a).toBe('a');
    updateValueByDict({ isUpdateValue: false, field: 'a', type: 'by', byField: 'b' }, dict, store);
    expect(store.values.a).toBe('a');
    updateValueByDict({ field: 'a', type: 'by', byField: 'b' }, dict, store);
    expect(store.values.a).toBeUndefined();
  });

  test('arr', () => {
    const store = new BaseStore({ defaultValues: { a: [1, 2, 3] }, api: {} });
    const dict = [{ value: 1, label: 'a1' }, { value: 2, label: 'a2' }];
    updateValueByDict({ field: 'a', type: 'by', byField: 'b' }, dict, store);
    expect(store.values.a).toEqual([1, 2]);
  });

  test('isMultiple str', () => {
    const store = new BaseStore({ defaultValues: { a: '1,2,3' }, fieldsConfig: { a: { 'x-component-props': { mode: 'tags' } } }, api: {} });
    const dict = [{ value: '1', label: 'a1' }, { value: '2', label: 'a2' }];
    updateValueByDict({ field: 'a', type: 'by', byField: 'b' }, dict, store);
    expect(store.values.a).toEqual('1,2');
  });
});

describe('StoreDict', () => {
  test('self', async () => {
    jest.useFakeTimers();
    const apiExecutor = jest.fn((params?: any) => Promise.resolve({ code: params?.code ?? 0, msg: '', data: params?.data }));
    const store = new BaseStore({
      api: {}, apiExecutor, dictConfig: [
        { field: 'a', data: [{ value: '1', label: 'a1' }] },
        { field: 'b', api: { url: '', data: [{ value: '2', label: 'a2' }] } },
        { field: 'c', data: [{ value: '1', label: 'a1' }], api: () => Promise.resolve({ code: 0, data: [{ value: '2', label: 'a2' }] }) },
        { field: 'd', data: [{ value: '1', label: 'a1' }], api: () => Promise.resolve({ code: 1, data: [{ value: '2', label: 'a2' }] }) },
        {
          field: 'e',
          isApiOptionsToMap: true,
          api: () => new Promise<IHTTPResponse>((resolve) => {
            setTimeout(() => resolve({ code: 0, msg: '', data: [{ value: '2', label: 'a2' }] }), 100);
          }),
        },
        {
          field: 'f',
          isApiOptionsToMap: true,
          toMapKeys: { value: 'id', label: 'name' },
          api: () => Promise.resolve({ code: 0, data: [{ id: '2', name: 'a2' }] }),
        },
      ],
    });
    render(<StoreDict store={store} />);
    expect(store.dictLoading.e).toBeTruthy();
    await act(async () => {
      jest.runAllTimers();
    });
    expect(store.dictLoading.e).toBeFalsy();
    expect(apiExecutor).toBeCalledTimes(1);
    expect(store.dict.a).toEqual([{ value: '1', label: 'a1' }]);
    expect(store.dict.b).toEqual([{ value: '2', label: 'a2' }]);
    expect(store.dict.c).toEqual([{ value: '2', label: 'a2' }]);
    expect(store.dict.d).toEqual([{ value: '1', label: 'a1' }]);
    expect(store.dict.e).toEqual({ 2: 'a2' });
    expect(store.dict.f).toEqual({ 2: 'a2' });
  });

  test('by getData', async () => {
    const getData = (val: any) => ([{ value: `${val}b`, label: `${val}b` }, { value: `${val}b1`, label: `${val}b1` }]);
    const store = new BaseStore({
      api: {},
      defaultValues: { a: 'a', b: 'b' },
      dictConfig: [{ field: 'b', type: 'by', byField: 'a', getData }],
    });

    expect(store.values.b).toBe('b');
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<StoreDict store={store} />);
    });
    expect(store.dict.b).toEqual([{ value: 'ab', label: 'ab' }, { value: 'ab1', label: 'ab1' }]);
    expect(store.values.b).toBeUndefined();

    store.setValuesByField('b', 'a1b');
    await act(async () => {
      store.setValuesByField('a', 'a1');
    });
    expect(store.dict.b).toEqual([{ value: 'a1b', label: 'a1b' }, { value: 'a1b1', label: 'a1b1' }]);
    expect(store.values.b).toBe('a1b');
  });

  test('by api', async () => {
    const time = 100;
    jest.useFakeTimers();
    const dataMap: Record<string, any[]> = {
      a: [{ value: 'a1', label: 'a1' }],
      b: [{ value: 'b1', label: 'b1' }],
      c: [{ value: 'c1', label: 'c1' }],
    };

    const apiExecutor = jest.fn((params?: any) => new Promise<IHTTPResponse>((resolve) => {
      setTimeout(() => resolve({ code: params?.params?.e ? 1 : 0, msg: '', data: dataMap[params?.params?.a] }), time);
    }));

    const store = new BaseStore({
      api: {}, apiExecutor,
      defaultValues: { a: 'a', b: 'b', c: 'c', e: 'e' },
      dictConfig: [
        { field: 'b', type: 'by', byField: 'a', api: { data: [] } },
        { field: 'c', type: 'by', byField: 'a', isApiOptionsToMap: true, api: { data: [] } },
        { field: 'e', type: 'by', byField: 'e', api: { data: [] } },
      ],
    });

    expect(store.values.b).toBe('b');
    render(<StoreDict store={store} />);
    expect(store.dictLoading.b).toBeTruthy();
    await act(async () => {
      jest.runAllTimers();
    });
    expect(store.dictLoading.b).toBeFalsy();
    expect(store.dict.b).toEqual(dataMap.a);
    expect(store.dict.c).toEqual({ a1: 'a1' });
    // 错误不更新
    expect(store.dict.e).toBeUndefined();

    store.setValuesByField('a', 'b');
    store.setValuesByField('a', '');
    await act(async () => {
      jest.runAllTimers();
    });
    expect(store.dict.b).toEqual([]);
    expect(store.values.b).toBeUndefined();
  });
});
