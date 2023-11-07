import { observer } from '@formily/reactive-react';
import { Button, Typography, message, Modal as AModal, ModalProps, Avatar, Tabs, Input } from 'antd';

import { useState } from 'react';

import { StorePage, Trigger, TriggerProps, useStore } from '../../library';

const Modal = (props: ModalProps & { trigger?: TriggerProps }) => {
  const { title, trigger, ...rest } = props;
  const [open, setOpen] = useState(false);

  return <>
    <Trigger
      onTrig={(...args) => {
        setOpen(true);
        trigger?.onTrig?.(...args);
      }}
      text={title}
      {...trigger}
    />
    <AModal open={open} {...rest} title="title" onCancel={() => setOpen(false)} />
  </>;
};

const ModalIn = (props: ModalProps & { trigger?: TriggerProps, value?: string, onChange?: (v: string) => void }) => {
  const { title, children, trigger, value, onChange, ...rest } = props;
  const [open, setOpen] = useState(false);

  return <>
    <Trigger
      onTrig={(...args) => {
        setOpen(true);
        trigger?.onTrig?.(...args);
      }}
      text={value || title}
      {...trigger}
    >
      {children ?? trigger?.children}
    </Trigger >
    <AModal open={open} {...rest} title="title" onCancel={() => setOpen(false)} >
      <Input value={value} onChange={e => onChange?.(e.target.value)} />
    </AModal>
  </>;
};


export const TriggerDemo = observer(() => {
  const store = useStore({ defaultValues: { str: '' } });

  const trig = () => {
    message.info('触发了 trig');
  };

  const click = () => {
    message.warning('触发了 click');
  };

  const mouseEnter = () => {
    message.success('触发了 mouseEnter');
  };

  const JSX = (
    <>
      <Typography.Title level={4}>基础使用</Typography.Title>
      <Trigger onTrig={trig} onClick={click} >触发器</Trigger>

      <Typography.Title level={4}>自定义事件 onMouseEnter</Typography.Title>
      <Trigger onTrig={trig} onMouseEnter={mouseEnter} onClick={click} trigEvent='onMouseEnter' >触发器</Trigger>

      <Typography.Title level={4}>children 基础</Typography.Title>
      <Trigger onTrig={trig} onClick={click} >字符串</Trigger>
      <Trigger onTrig={trig} onClick={click} >{null}</Trigger>
      <Trigger onTrig={trig} onClick={click} >{undefined}</Trigger>
      <Trigger onTrig={trig} onClick={click} >{false}</Trigger>

      <Typography.Title level={4}>children 节点</Typography.Title>
      <Trigger onTrig={trig} onClick={click} >
        <Button onClick={click}>触发器</Button>
      </Trigger>

      <Typography.Title level={4}>children 多节点</Typography.Title>
      <Trigger onTrig={trig} onClick={click} text='触发器 - text' >
        触发器-字符串
        <Button onClick={click}>触发器 - 按钮</Button>
        <Button onClick={click} />
      </Trigger>

      <Typography.Title level={4}>children Fragment</Typography.Title>
      <Trigger onTrig={trig} onClick={click} text='触发器 - text' >
        <>
          触发器-字符串
          <Button onClick={click}>触发器 - 按钮</Button>
          <Button onClick={click} />
        </>
      </Trigger>
    </>);

  const baseSchema = (<StorePage
    components={{ Button, Title: Typography.Title, Trigger }}
    store={{}}
    schema={{
      type: 'object',
      properties: {
        base: {
          type: 'void',
          properties: {
            title: {
              type: 'void',
              title: '标题',
              'x-component': 'Title',
              'x-component-props': {
                level: 4,
                children: '基础使用',
              },
            },
            trigger: {
              type: 'void',
              title: '触发器',
              'x-component': 'Trigger',
              'x-component-props': {
                onTrig: trig,
                onClick: click,
                children: '触发器',
              },
            },
          },
        },
        decorator: {
          type: 'void',
          properties: {
            title: {
              type: 'void',
              'x-component': 'Title',
              'x-component-props': {
                level: 4,
                children: 'decorator',
              },
            },
            trigger: {
              'x-decorator': 'Trigger',
              'x-decorator-props': {
                text: '触发器',
                onTrig: trig,
                onClick: click,
              },
              'x-component': 'Button',
            },
          },
        },
        children: {
          type: 'void',
          properties: {
            title: {
              type: 'void',
              title: '标题',
              'x-component': 'Title',
              'x-component-props': {
                level: 4,
                children: 'properties',
              },
            },
            trigger: {
              type: 'void',
              title: '触发器',
              'x-component': 'Trigger',
              'x-component-props': {
                onTrig: trig,
                onClick: click,
                text: '触发器',
              },
              properties: {
                btn: {
                  type: 'void',
                  'x-component': 'Button',
                  'x-component-props': {
                    children: 'btn',
                  },
                },
                btn2: {
                  type: 'void',
                  'x-component': 'Button',
                },
              },
            },
          },
        },
      },
    }}
  />);

  const cJSX = (<>
    <Typography.Title level={4}>基础使用</Typography.Title>
    <Modal title='Modal' >Modal</Modal>

    <Typography.Title level={4}>自定义组件</Typography.Title>
    <Modal title='Modal' trigger={{ component: Avatar, onTrig: trig }} >Modal</Modal>

    <Typography.Title level={4}>子节点作为触发器</Typography.Title>
    <ModalIn title='Modal' value={store.values.str} onChange={v => store.setValues({ str: v })}  >
      <Button />
    </ModalIn>
  </>
  );

  const cSchema = (
    <StorePage
      store={store}
    />
  );
  return (
    <div>
      <Tabs defaultActiveKey="cJSX" items={[
        { key: 'JSX', label: 'JSX 调用', children: JSX },
        { key: 'schema', label: 'Schema', children: baseSchema },
        { key: 'cJSX', label: '作为子组件 JSX 调用', children: cJSX },
        { key: 'cSchema', label: '作为子组件 Schema 调用', children: cSchema },
      ]} />
    </div>
  );
});
