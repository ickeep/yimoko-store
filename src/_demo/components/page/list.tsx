import React from 'react';

import { ListPage } from '../../../library';

export const ListPageDemo = () => (
  <ListPage
    storeConfig={{
      fieldsConfig: {},
      api: {
        list: { url: '/api/list.json' },
      },
    }}
    store={{
      defaultValues: { name: '' },
      isBindRouter: true,
      api: () => new Promise(resolve => setTimeout(() => resolve({ code: 0, msg: '编辑成功', data: { page: 1, data: [{ name: '张三' }, { name: '李四' }] } }), 1000)),
    }}
    schema={{
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: '标题',
          'x-component': 'Title',
          'x-component-props': {
            level: 3,
            children: 'List Page Demo',
          },
        },
        name: {
          type: 'string',
          title: '姓名',
          'x-component': 'Input',
        },
        submit: {
          type: 'void',
          title: '提交',
          'x-component': 'Button',
          'x-component-props': {
            style: { marginTop: 20 },
            type: 'primary',
            children: '提交',
            onClick: '{{curStore.runAPI}}',
            loading: '{{curStore.loading}}',
          },
        },
        ArrayRender: {
          type: 'void',
          'x-decorator': 'StorePageContent',
          'x-decorator-props': {
            load: true,
          },
          'x-component': 'ArrayRender',
          'x-component-props': {
            // isRenderProperties: true,
            data: '{{curStore.listData}}',
          },
          items: [
            {
              name: 'name',
              type: 'string',
              title: '姓名',
              'x-component': 'Title',
              'x-component-props': {
                level: 5,
                children: '{{$record.name + " - " + $index }} ',
              },
            },
          ],
          properties: {
            text: {
              type: 'void',
              'x-component': 'div',
              'x-component-props': {
                children: 'Render Properties',
              },
            },
          },

        },
      },
    }}
  />
);
