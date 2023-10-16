import { screen, render, fireEvent } from '@testing-library/react';

import { BaseStore } from '../store/base';

import { ArrayBase, ArrayRender, withArrayComponent, withArrayItemComponent } from './array-base';
import { StorePage } from './page/store';
import { RenderValue } from './render-value';

describe('ArrayBase', () => {
  test('render', () => {
    render(<ArrayBase >array</ArrayBase>);
    expect(document.body.textContent).toBe('array');
  });

  test('render str', () => {
    const store = new BaseStore({ defaultValues: { array: ['张三', '李四'] } });
    render(<StorePage
      components={{ ArrayRender, RenderValue }}
      store={store}
      schema={{
        type: 'object',
        properties: {
          array: {
            type: 'array',
            'x-component': 'ArrayRender',
            'x-component-props': { isRenderProperties: true },
            items: [{ type: 'string', 'x-component': 'RenderValue' }],
            properties: {
              content: { type: 'void', 'x-component': 'div', 'x-component-props': { children: '{{$records.join("-")}}' } },
            },
          },
        },
      }}
    />);
    expect(document.body.textContent).toBe('张三李四张三-李四');
  });

  test('render num', () => {
    const store = new BaseStore({ defaultValues: { array: [1, 2, 3, 4, 5, 6] } });
    render(<StorePage
      components={{ ArrayRender, RenderValue }}
      store={store}
      schema={{
        type: 'object',
        properties: {
          array: {
            type: 'array',
            'x-component': 'ArrayRender',
            items: [
              { type: 'string', 'x-component': 'RenderValue' },
              {
                type: 'void', 'x-component': 'div', properties: {
                  label: {
                    type: 'void',
                    'x-component': 'span',
                    'x-component-props': { children: 'label:' },
                  },
                  value: { type: 'string', 'x-component': 'RenderValue' },
                },
              },
            ],
          },
        },
      }}
    />);
    expect(document.body.textContent).toBe('1label:23456');
  });

  test('array 操作', () => {
    const EmptyPush = withArrayComponent((props: any) => <div {...props} />, {}, { children: 'emptyPush' });
    const Push = withArrayComponent((props: any) => <div {...props} />, { onPush: 'onClick' }, { children: 'push' });
    const Pop = withArrayComponent((props: any) => <div {...props} />, { onPop: 'onClick' }, { children: 'pop' });
    const Insert = withArrayComponent((props: any) => <div {...props} />, { onInsert: 'onClick' }, { children: 'insert' });
    const Remove = withArrayComponent((props: any) => <div {...props} />, { onRemove: 'onClick' }, { children: 'remove' });
    const Shift = withArrayComponent((props: any) => <div {...props} />, { onShift: 'onClick' }, { children: 'shift' });
    const Unshift = withArrayComponent((props: any) => <div {...props} />, { onUnshift: 'onClick' }, { children: 'unshift' });
    const Move = withArrayComponent((props: any) => <div {...props} />, { onMove: 'onClick' }, { children: 'move' });
    const store = new BaseStore({ defaultValues: { array: ['张三', '李四'] } });
    render(<StorePage
      components={{ ArrayRender, RenderValue, EmptyPush, Push, Pop, Insert, Remove, Shift, Unshift, Move }}
      store={store}
      schema={{
        type: 'object',
        properties: {
          array: {
            type: 'array',
            'x-component': 'ArrayRender',
            'x-component-props': { isRenderProperties: true },
            items: [{ type: 'string', 'x-decorator': 'div', 'x-component': 'RenderValue' }],
            properties: {
              emptyPush: { type: 'void', 'x-component': 'EmptyPush', 'x-component-props': { arrayParams: { items: ['王五'] } } },
              push: { type: 'void', 'x-component': 'Push', 'x-component-props': { arrayParams: { items: ['王五'] } } },
              pop: { type: 'void', 'x-component': 'Pop' },
              insert: { type: 'void', 'x-component': 'Insert', 'x-component-props': { arrayParams: { index: 1, items: ['王五'] } } },
              remove: { type: 'void', 'x-component': 'Remove', 'x-component-props': { arrayParams: { index: 1 } } },
              shift: { type: 'void', 'x-component': 'Shift' },
              unshift: { type: 'void', 'x-component': 'Unshift', 'x-component-props': { arrayParams: { items: ['张三'] } } },
              move: { type: 'void', 'x-component': 'Move', 'x-component-props': { arrayParams: { index: 1, toIndex: 0 } } },
            },
          },
        },
      }}
    />);
    fireEvent.click(screen.getByText('emptyPush'));
    fireEvent.click(screen.getByText('push'));
    expect(screen.getByText('王五')).toBeInTheDocument();
    fireEvent.click(screen.getByText('pop'));
    expect(screen.queryByText('王五')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('insert'));
    expect(screen.getByText('王五')).toBeInTheDocument();
    fireEvent.click(screen.getByText('remove'));
    expect(screen.queryByText('王五')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('shift'));
    expect(screen.queryByText('张三')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('unshift'));
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(store.values.array).toEqual(['张三', '李四']);
    fireEvent.click(screen.getByText('move'));
    expect(store.values.array).toEqual(['李四', '张三']);
    fireEvent.click(screen.getByText('move'));
    expect(store.values.array).toEqual(['张三', '李四']);
  });


  test('array item 操作', () => {
    const EmptyItemMoveUp = withArrayItemComponent((props: any) => <div {...props} />, {}, { children: 'emptyUp' });
    const ItemMoveUp = withArrayItemComponent((props: any) => <div {...props} />, { onMoveUp: 'onClick' }, { children: 'up' });
    const ItemMoveDown = withArrayItemComponent((props: any) => <div {...props} />, { onMoveDown: 'onClick' }, { children: 'down' });
    const ItemRemove = withArrayItemComponent((props: any) => <div {...props} />, { onRemove: 'onClick' }, { children: 'remove' });
    const ItemCopy = withArrayItemComponent((props: any) => <div {...props} />, { onCopy: 'onClick' }, { children: 'copy' });
    const store = new BaseStore({ defaultValues: { array: ['张三', '李四', '王五'] } });
    render(<StorePage
      components={{ ArrayRender, RenderValue, EmptyItemMoveUp, ItemMoveUp, ItemMoveDown, ItemRemove, ItemCopy }}
      store={store}
      schema={{
        type: 'object',
        properties: {
          array: {
            type: 'array',
            'x-component': 'ArrayRender',
            items: {
              type: 'void',
              'x-component': 'div',
              properties: {
                value: { type: 'string', 'x-component': 'RenderValue' },
                emptyUp: { type: 'void', 'x-component': 'EmptyItemMoveUp' },
                up: { type: 'void', 'x-component': 'ItemMoveUp' },
                down: { type: 'void', 'x-component': 'ItemMoveDown' },
                remove: { type: 'void', 'x-component': 'ItemRemove' },
                copy: { type: 'void', 'x-component': 'ItemCopy' },
              },
            },
            properties: {
              test: { type: 'void', 'x-component': 'div', 'x-component-props': { children: 'test' } },
            },
          },
        },
      }}
    />);

    fireEvent.click(screen.getAllByText('emptyUp')[1]);
    expect(store.values.array).toEqual(['张三', '李四', '王五']);
    fireEvent.click(screen.getAllByText('up')[1]);
    expect(store.values.array).toEqual(['李四', '张三', '王五']);
    fireEvent.click(screen.getAllByText('down')[2]);
    expect(store.values.array).toEqual(['王五', '李四', '张三']);
    fireEvent.click(screen.getAllByText('down')[0]);
    expect(store.values.array).toEqual(['李四', '王五', '张三']);
    fireEvent.click(screen.getAllByText('remove')[1]);
    expect(store.values.array).toEqual(['李四', '张三']);
    fireEvent.click(screen.getAllByText('copy')[0]);
    expect(store.values.array).toEqual(['李四', '李四', '张三']);
    fireEvent.click(screen.getAllByText('copy')[2]);
    expect(store.values.array).toEqual(['李四', '李四', '张三', '张三']);
  });

  test('not item', () => {
    const store = new BaseStore({ defaultValues: { array: ['张三', '李四'] } });
    render(<StorePage
      components={{ ArrayRender }}
      store={store}
      schema={{
        type: 'object',
        properties: {
          array: {
            type: 'array',
            'x-component': 'ArrayRender',
            'x-component-props': { children: 'array' },
          },
        },
      }}
    />);
    expect(document.body.textContent).toBe('array');
  });
});
