import { act, render } from '@testing-library/react';

import { BaseStore } from '../../store/base';

import { DetailPage } from './detail';

describe('add page', () => {
  const Name = ({ value }: any) => <div>{value}</div>;
  test('empty', () => {
    render(<DetailPage storeConfig={{ fieldsConfig: {}, api: {} }} />);
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
    const api = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: { name: 'test' } }));

    const dataStore = new BaseStore({ api, isRunNow: true });
    render(<DetailPage
      dataStore={dataStore}
      components={{ Name }}
      storeConfig={{ fieldsConfig: { name: {} }, api: {} }}
      schema={{ type: 'object', properties: { name: { type: 'string', 'x-component': 'Name' } } }}
    />);
    await act(async () => {
      expect(document.body.textContent).toBe('loading');
    });
    expect(document.body.textContent).toBe('test');
  });
});
