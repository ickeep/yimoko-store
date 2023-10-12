
import { RecordScope, RecordsScope, RecursionField, useField, useFieldSchema } from '@formily/react';
import { observable } from '@formily/reactive';
import { Button, Table, TableProps } from 'antd';
import { useCallback, useMemo } from 'react';

import { getItemPropsBySchema, judgeIsEmpty, useSchemaItems, useStore, ArrayBase, withArrayComponent, withArrayItemComponent, StorePage } from '../../library';

const ArgOut = (props: any) => {
  const { value, val } = props;
  return <>arg-{value}-{val}</>;
};

const Push = withArrayComponent(Button, { onPush: 'onClick' }, { type: 'text', children: 'Push' });

const Pop = withArrayComponent(Button, { onPop: 'onClick' }, { type: 'text', children: 'Pop' });

const Insert = withArrayComponent(Button, { onInsert: 'onClick' }, { type: 'text', children: 'Insert' });

const Remove = withArrayComponent(Button, { onRemove: 'onClick' }, { type: 'text', children: 'Remove' });

const Shift = withArrayComponent(Button, { onShift: 'onClick' }, { type: 'text', children: 'Shift' });

const Unshift = withArrayComponent(Button, { onUnshift: 'onClick' }, { type: 'text', children: 'Unshift' });

const Move = withArrayComponent(Button, { onMove: 'onClick' }, { type: 'text', children: 'Move' });

const ItemMoveUp = withArrayItemComponent(Button, { onMoveUp: 'onClick' }, { type: 'text', children: 'ItemMoveUp' });

const ItemMoveDown = withArrayItemComponent(Button, { onMoveDown: 'onClick' }, { type: 'text', children: 'ItemMoveDown' });

const ItemRemove = withArrayItemComponent(Button, { onRemove: 'onClick' }, { type: 'text', children: 'ItemRemove' });

const ItemCopy = withArrayItemComponent(Button, { onCopy: 'onClick' }, { type: 'text', children: 'ItemCopy' });

const TestTable = observable((props: TableProps<any> & { value?: TableProps<any>['dataSource'] }) => {
  const { columns = [], dataSource, rowKey, value, children, ...rest } = props;
  const items = useSchemaItems();
  const field = useField();
  const schema = useFieldSchema();
  const curDataSource = (dataSource ?? value);

  const curChildren = useMemo(() => {
    if (children !== undefined) {
      return children;
    }
    if (judgeIsEmpty(schema.properties)) {
      return null;
    }
    // 默认 schema type 为 array 不渲染 properties, 表格这里特意做加强
    return <RecursionField name={schema.name} onlyRenderProperties schema={{ type: 'void', properties: schema.properties }} />;
  }, [children, schema]);


  // 解决默认 rowKey 各 低代码时取 实际数据 index 的问题
  const getRecordIndex = useCallback(() => {
    // 利用闭包 按需生成
    let recordIndexMap: Map<any, number>;
    return (record: any) => {
      if (!recordIndexMap) {
        recordIndexMap = new Map();
        curDataSource?.forEach((item, index) => {
          recordIndexMap.set(item, index);
        });
      }
      return recordIndexMap.get(record) ?? 0;
    };
  }, [curDataSource])();

  const curColumns = useMemo(() => {
    const itemsColumns = items.map((item) => {
      const baseProps = {
        dataIndex: item.name,
        title: item.title,
        ...getItemPropsBySchema(item, 'Column'),
      };
      if (judgeIsEmpty(item['x-component'])) {
        return baseProps;
      }
      return ({
        ...baseProps,
        render: (v: any, r: any) => {
          const dataIndex = getRecordIndex(r);
          const { children } = getItemPropsBySchema(item, 'Column', dataIndex);
          return (
            <RecordScope getRecord={() => r ?? {}} getIndex={() => dataIndex}>
              {children}
            </RecordScope>
          );
        },
      });
    });

    return [...columns, ...itemsColumns];
  }, [columns, getRecordIndex, items]);

  return (
    // @ts-ignore
    <RecordsScope getRecords={() => curDataSource}>
      <ArrayBase disabled={field.disabled} isForceUpdate={true}  >
        <Table {...rest}
          dataSource={curDataSource}
          columns={curColumns}
          rowKey={rowKey ?? getRecordIndex}
          onChange={(...rest) => console.log(rest)} />
        <div>123</div>
        {curChildren}
      </ArrayBase>
    </RecordsScope>);
});

export const ArrayBaseDemo = () => {
  const store = useStore({
    defaultValues: {
      array: [
        { name: 'keep', age: 20 },
        { name: 'jf', age: 22 },
        { name: 'jf x', age: 33 },
      ],
    },
  });

  return (
    <StorePage
      components={{ Table: TestTable, ArgOut, Pop, Push, Insert, Remove, Shift, Unshift, Move, ItemMoveUp, ItemMoveDown, ItemRemove, ItemCopy }}
      store={store}
      schema={{
        type: 'object',
        properties: {
          array: {
            type: 'array',
            'x-component': 'Table',
            'x-component-props': {
              // rowKey: 'name',
              columns: [
                { title: 'name', dataIndex: 'name' },
                {
                  title: 'age',
                  dataIndex: 'age',
                  sorter: (a: any, b: any) => a.age - b.age,
                },
              ],
            },
            items: [
              {
                name: 'age', title: '年龄', type: 'number', 'x-component': 'ArgOut',
                'x-component-props': {
                  val: '{{$record.age}}',
                },
              },
              {
                name: 'name',
                title: '操作',
                type: 'void',
                'x-component': 'div',
                properties: {
                  ItemMoveUp: {
                    'x-component': 'ItemMoveUp',
                    'x-component-props': {
                      onClick: (...args: any) => {
                        console.log('args', args);
                      },
                    },
                  },
                  ItemMoveDown: {
                    'x-component': 'ItemMoveDown',
                    'x-component-props': {
                      onClick: (...args: any) => {
                        console.log('args', args);
                      },
                    },
                  },
                  ItemRemove: {
                    'x-component': 'ItemRemove',
                    'x-component-props': {
                      onClick: (...args: any) => {
                        console.log('args', args);
                      },
                    },
                  },
                  ItemCopy: {
                    'x-component': 'ItemCopy',
                    'x-component-props': {
                      onClick: (...args: any) => {
                        console.log('args', args);
                      },
                    },
                  },
                },
              },
            ],
            properties: {
              push: {
                type: 'void',
                'x-component': 'Push',
                'x-component-props': {
                  arrayParams: { items: [{ name: 'push', age: 20 }] },
                  onClick: (...args: any) => {
                    console.log('push args', ...args);
                  },
                },
              },
              pop: {
                type: 'void',
                'x-component': 'Pop',
              },
              Insert: {
                type: 'void',
                'x-component': 'Insert',
                'x-component-props': {
                  arrayParams: { items: [{ name: 'insert', age: 20 }] },
                  onClick: (...args: any) => {
                    console.log('insert args', ...args);
                  },
                },
              },
              Remove: {
                type: 'void',
                'x-component': 'Remove',
                'x-component-props': {
                  arrayParams: { index: 1 },
                  onClick: (...args: any) => {
                    console.log('remove args', ...args);
                  },
                },
              },
              Shift: {
                type: 'void',
                'x-component': 'Shift',
              },
              Unshift: {
                type: 'void',
                'x-component': 'Unshift',
                'x-component-props': {
                  arrayParams: { items: [{ name: 'unshift', age: 20 }] },
                  onClick: (...args: any) => {
                    console.log('unshift args', ...args);
                  },
                },
              },
              Move: {
                type: 'void',
                'x-component': 'Move',
                'x-component-props': {
                  arrayParams: { index: 0, toIndex: 2 },
                  onClick: (...args: any) => {
                    console.log('move args', ...args);
                  },
                },
              },
            },
          },
        },
      }} />
  );
};
