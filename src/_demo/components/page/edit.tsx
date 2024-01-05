import React from 'react';

import { EditPage } from '../../../library';

export const EditPageDemo = () => (
  <EditPage<any>
    storeConfig={{
      fieldsConfig: {},
      defaultValues: { id: '', name: 'edit' },
      api: {
        edit: { url: '/api/edit.json' },
        detail: { url: '/api/detail.json' },
      },
    }}
    // dataStore={{
    //   // 查看 loading 状态

    //   // api: () => new Promise(resolve => setTimeout(() => resolve({ code: 0, msg: '编辑成功', data: { name: '张三' } }), 1000)),
    //   // api: () => new Promise(resolve => setTimeout(() => resolve({ code: 500, msg: '服务器出错了' }), 1000)),
    // }}
    store={{ defaultValues: { name: '' } }}
    schema={{
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: '标题',
          'x-component': 'Title',
          'x-component-props': {
            level: 3,
            children: 'Edit Page Demo',
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
      },
    }}
  />
);
