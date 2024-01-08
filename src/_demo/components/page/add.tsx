
import React from 'react';

import { AddPage } from '../../../library';

export const AddPageDemo = () => (
  <AddPage<any>
    config={{
      fieldsConfig: {
      },
      api: {
        add: { method: 'get', url: '/api/add.json' },
      },
      defaultValues: { age: 4 },
    }}
    store={{
      defaultValues: { name: 'add' },
      // 查看 loading 状态
      // api: () => new Promise(resolve => setTimeout(() => resolve({ code: 0, msg: '添加成功' }), 1000)),
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
            children: 'Add Page Demo',
          },
        },
        age: {
          type: 'number',
          title: '年龄',
          'x-component': 'InputNumber',
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
      },
    }}
  />
);
