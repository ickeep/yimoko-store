// 测试对子组件具有侵入性的组件 使用 schema 适配

import { Space as ASpace, Button, SpaceProps, Tabs } from 'antd';

import { StorePage } from '../../../library';

export const Space = (props: SpaceProps) => {
  console.log('Space', props);
  return <ASpace {...props} />;
};

export const SpaceDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <Space><Button>1</Button><Button>2</Button></Space> },
      { key: 'schema', label: 'Schema', children: <SpaceSchema /> },
    ]} />
  </div>
);


const SpaceSchema = () => (
  <StorePage
    store={{ defaultValues: { radio: '1' } }}
    components={{ Space }}
    schema={{
      type: 'object',
      properties: {
        space: {
          type: 'void',
          'x-component': 'Space',
          'x-component-props': {
          },
          properties: {
            btn: {
              type: 'void',
              'x-component': 'Button',
              'x-component-props': {
                children: '1',
              },
            },
            btn2: {
              type: 'void',
              'x-component': 'Button',
              'x-component-props': {
                children: '2',
              },
            },
          },
        },

      },
    }}
  />
);
