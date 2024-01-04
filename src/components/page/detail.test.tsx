import { act, render } from '@testing-library/react';

import React from 'react';

import { BaseStore } from '../../store/base';

import { DetailPage } from './detail';

describe('detail page', () => {
  const Name = ({ value }: any) => <div>{value}</div>;
  test('empty', () => {
    render(<DetailPage />);
    act(() => {
      expect(document.body.textContent).toBe('loading');
    });
  });

  test('values', () => {
    render(<DetailPage
      components={{ Name }}
      values={{ name: '张三' }}
      storeConfig={{ fieldsConfig: {}, api: {} }}
      schema={{ type: 'object', properties: { name: { type: 'string', 'x-component': 'Name' } } }}
    />);
    act(() => {
      expect(document.body.textContent).toBe('张三');
    });
  });

  test('store', async () => {
    const store = new BaseStore();
    const api = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: { name: 'test' } }));
    render(<DetailPage
      components={{ Name }}
      isPickValues={false}
      store={store}
      storeConfig={{ fieldsConfig: { name: {} }, api: { detail: api } }}
      schema={{ type: 'object', properties: { name: { type: 'string', 'x-component': 'Name' } } }}
    />);
    await act(async () => {
      expect(document.body.textContent).toBe('loading');
    });
    expect(document.body.textContent).toBe('test');
    expect(store.fieldsConfig).toEqual({ name: {} });
  });

  test('dataStore', async () => {
    const api = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: { name: 'test', cnName: '测试' } }));
    const dataStore = new BaseStore({ api, isRunNow: true, defaultValues: { name: '' } });
    const store = new BaseStore({ defaultValues: { name: '' } });
    render(<DetailPage
      dataStore={dataStore}
      store={store}
      isPickValues={true}
      components={{ Name }}
      schema={{ type: 'object', properties: { name: { type: 'string', 'x-component': 'Name' } } }}
    />);
    await act(async () => {
      expect(document.body.textContent).toBe('loading');
    });
    expect(document.body.textContent).toBe('test');
    expect(store.values).toEqual({ name: 'test' });
  });
});
