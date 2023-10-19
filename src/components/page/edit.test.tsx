import { act, render } from '@testing-library/react';

import { BaseStore } from '../../store/base';

import { EditPage } from './edit';

describe('edit page', () => {
  const Name = ({ value }: any) => <div>{value}</div>;
  test('empty', () => {
    render(<EditPage />);
    act(() => {
      expect(document.body.textContent).toBe('loading');
    });
  });

  test('values', () => {
    render(<EditPage
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
    render(<EditPage
      components={{ Name }}
      isPickValues={false}
      store={store}
      storeConfig={{ fieldsConfig: { name: {} }, api: { detail: api, edit: { url: 'edit' } } }}
      schema={{ type: 'object', properties: { name: { type: 'string', 'x-component': 'Name' } } }}
    />);
    await act(async () => {
      expect(document.body.textContent).toBe('loading');
    });
    expect(document.body.textContent).toBe('test');
    expect(store.fieldsConfig).toEqual({ name: {} });
    expect(store.api).toEqual({ url: 'edit' });
  });

  test('dataStore', async () => {
    const api = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: { name: 'test', cnName: '测试' } }));
    const editAPI = jest.fn();
    const dataStore = new BaseStore({ api, isRunNow: true, defaultValues: { name: '' } });
    const store = new BaseStore({ defaultValues: { name: '' }, api: editAPI });
    render(<EditPage
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
    expect(editAPI).toBeCalledTimes(0);
    store.runAPI();
    expect(editAPI).toBeCalledTimes(1);
    expect(editAPI).toBeCalledWith({ name: 'test' });
  });
});
