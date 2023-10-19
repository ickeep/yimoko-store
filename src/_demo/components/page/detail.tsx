
import { DetailPage } from '../../../library';

export const DetailPageDemo = () => (
  <DetailPage
    storeConfig={{
      fieldsConfig: {},
      api: {
        detail: { url: '/api/detail.json' },
      },
    }}
    dataStore={{
      // 查看 loading 状态
      // api: () => new Promise(resolve => setTimeout(() => resolve({ code: 0, msg: '添加成功', data: { name: '张三' } }), 1000)),
      // api: () => new Promise(resolve => setTimeout(() => resolve({ code: 500, msg: '服务器出错了' }), 1000)),
    }}
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
            children: 'Detail Page Demo',
          },
        },
        name: {
          type: 'string',
          title: '姓名',
          'x-component': 'Title',
        },
        Button: {
          type: 'void',
          title: '再次请求',
          'x-component': 'Button',
          'x-component-props': {
            style: { marginTop: 20 },
            type: 'primary',
            children: '再次请求',
            onClick: '{{dataStore.runAPI}}',
            loading: '{{dataStore.loading}}',
          },
        },
      },
    }}
  />
);
