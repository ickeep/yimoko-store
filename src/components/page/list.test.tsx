import { act, render, screen } from '@testing-library/react';

import React from 'react';

import { ListStore } from '../../store/list';

import { ListPage } from './list';

describe('list page', () => {
  const Name = ({ value }: any) => <div>{value}</div>;
  test('empty', () => {
    render(<ListPage store={{}} />);
    act(() => {
      expect(document.body.textContent).toBe('');
    });
  });

  test('values', () => {
    render(<ListPage
      store={{ defaultValues: { name: '张三' } }}
      components={{ Name }}
      config={{ fieldsConfig: {}, api: {} }}
      schema={{ type: 'object', properties: { name: { type: 'string', 'x-component': 'Name' } } }}
    />);
    act(() => {
      expect(document.body.textContent).toBe('张三');
    });
  });

  test('store', async () => {
    const store = new ListStore();
    const api = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: [{ name: 'test' }] }));
    render(<ListPage
      components={{ Name }}
      store={store}
      config={{ fieldsConfig: { name: {} }, api: { list: api } }}
      schema={{
        type: 'object',
        properties: {
          name: {
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              children: '{{curStore?.listData?.[0]?.name}}',
            },
          },
        },
      }}
    />);
    await act(async () => {
      expect(document.body.textContent).toBe('');
    });
    expect(document.body.textContent).toBe('test');
    expect(store.fieldsConfig).toEqual({ name: {} });
    expect(store.listData).toEqual([{ name: 'test' }]);
  });

  test('scope', async () => {
    const store = new ListStore();
    const api = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: [{ name: 'test' }] }));
    render(<ListPage
      components={{ Name }}
      store={store}
      config={{ idKey: 'name', basePath: '/list', fieldsConfig: { name: {} }, api: { list: api } }}
      schema={{
        type: 'object',
        properties: {
          addPath: {
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              role: 'add',
              children: '{{getAddPath()}}',
            },
          },
          editPath: {
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              role: 'edit',
              children: '{{getEditPath({ name: "test" })}}',
            },
          },
          detailPath: {
            type: 'void',
            'x-component': 'div',
            'x-component-props': {
              role: 'detail',
              children: '{{getDetailPath({ name: "test" })}}',
            },
          },
        },
      }}
    />);
    await act(async () => {
      expect(document.body.textContent).not.toBe('');
    });
    expect(store.fieldsConfig).toEqual({ name: {} });
    expect(store.listData).toEqual([{ name: 'test' }]);
    expect(screen.getByRole('add').textContent).toBe('/list/add');
    expect(screen.getByRole('edit').textContent).toBe('/list/edit?name=test');
    expect(screen.getByRole('detail').textContent).toBe('/list/detail?name=test');
  });
});
