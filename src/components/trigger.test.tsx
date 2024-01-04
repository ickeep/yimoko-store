import { ISchema } from '@formily/react';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { Avatar, Button, Input, message, Modal as AModal, ModalProps, Typography } from 'antd';

import React, { useEffect, useMemo, useState } from 'react';

import { useChildrenNullishCoalescing } from '../hooks/use-children-nullish-coalescing';

import { useStore } from '../hooks/use-store';

import { StorePage } from './page/store';
import { Trigger, TriggerProps } from './trigger';

const Modal = (props: ModalProps & { trigger?: TriggerProps }) => {
  const { title, trigger, onCancel, onOk, ...rest } = props;
  const [open, setOpen] = useState(false);
  return <>
    <Trigger
      text={title}
      {...trigger}
      onTrig={(...args) => {
        setOpen(true);
        trigger?.onTrig?.(...args);
      }}
    />
    <AModal
      open={open}
      {...rest}
      title='title'
      onCancel={(e) => {
        setOpen(false);
        onCancel?.(e);
      }}
      onOk={(e) => {
        setOpen(false);
        onOk?.(e);
      }}
    />
  </>;
};
const ModalIn = (props: ModalProps & { trigger?: TriggerProps, value?: string, onChange?: (v?: string) => void }) => {
  const { title, children, trigger, value, onChange, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(value);

  const curChildren = useChildrenNullishCoalescing(children);
  useEffect(() => {
    setVal(value);
  }, [value]);

  const curText = value || title;

  const triggerEl = useMemo(() => (
    <Trigger
      onTrig={(...args) => {
        setOpen(true);
        trigger?.onTrig?.(...args);
      }}
      text={curText}
      {...trigger}
    >
      {curChildren ?? trigger?.curChildren}
    </Trigger>
  ), [curChildren, curText, trigger]);

  return <>
    {triggerEl}
    <AModal
      {...rest}
      open={open}
      title='title'
      onCancel={() => setOpen(false)}
      onOk={() => {
        onChange?.(val);
        setOpen(false);
      }}
    >
      <Input value={val} onChange={e => setVal?.(e.target.value)} />
    </AModal>
  </>;
};
describe('JSX', () => {
  const triggerRender = (props: TriggerProps) => render(<Trigger {...props} />);
  test('string', () => {
    triggerRender({ children: 'children as string' });
    expect(screen.getByText('children as string')).toBeInTheDocument();
  });
  test('null', () => {
    const { container } = triggerRender({ children: null });
    expect(container).toBeEmptyDOMElement();
  });
  test('undefined', () => {
    const { container } = triggerRender({ children: undefined });
    expect(container).not.toBeEmptyDOMElement();
  });
  test('false', () => {
    const { container } = triggerRender({ children: false });
    expect(container.innerHTML).toBe('');
  });
  test('node', () => {
    const node = <div>children as node</div>;
    triggerRender({ children: node });
    expect(screen.getByText('children as node')).toBeInTheDocument();
  });
  test('multiple nodes', () => {
    const node = (
      <div>
        <div>children as node1</div>
        <div>children as node2</div>
      </div>
    );
    const { container } = triggerRender({ children: node, text: 'text' });
    expect(container.innerHTML).toBe('<div><div>children as node1</div><div>children as node2</div></div>');
  });
  test('Fragment', () => {
    const node = (
      <>
        <div>children as node1</div>
        <div>children as node2</div>
      </>
    );
    const { container } = triggerRender({ children: node, text: 'text' });
    expect(container.innerHTML).toBe('<div>children as node1</div><div>children as node2</div>');
  });
});

describe('schema', () => {
  const triggerRender = (schema: ISchema) => render(<StorePage store={{}} schema={schema} components={{
    Trigger,
    Button,
  }} />);
  test('base', () => {
    triggerRender({
      type: 'object',
      properties: {
        trigger: {
          type: 'void',
          'x-component': 'Trigger',
          'x-component-props': { children: 'children as string' },
        },
      },
    });
    expect(screen.getByText('children as string')).toBeInTheDocument();
  });
  test('decorator', () => {
    triggerRender({
      type: 'object',
      properties: {
        trigger: {
          type: 'void',
          'x-decorator': 'Trigger',
          'x-decorator-props': {
            text: 'children as decorator',
          },
          'x-component': 'div',
        },
      },
    });
    expect(screen.getByText('children as decorator')).toBeInTheDocument();
  });
  test('children as schema', () => {
    triggerRender({
      type: 'object',
      properties: {
        trigger: {
          type: 'void',
          'x-component': 'Trigger',
          'x-component-props': {
            text: 'children as schema',
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
    });
    expect(screen.getByText('btn')).toBeInTheDocument();
    expect(screen.getByText('children as schema')).toBeInTheDocument();
  });
});

describe('children jsx', () => {
  const triggerRender = (props: ModalProps & { trigger?: TriggerProps }) => render(<Modal {...props} />);
  test('base', () => {
    triggerRender({
      trigger: {
        children: 'children jsx base',
      },
      children: 'Modal children',
    });
    expect(screen.getByText('children jsx base')).toBeInTheDocument();
    expect(screen.queryByText('Modal children')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('children jsx base'));
    expect(screen.getByText('Modal children')).toBeInTheDocument();
  });
  test('component', async () => {
    const trig = () => {
      message.info('触发了 trig');
    };
    triggerRender({
      trigger: {
        component: props => <Button {...props}>click me</Button>,
        onTrig: trig,
      },
      children: 'Modal children',
    });
    expect(screen.getByText('click me')).toBeInTheDocument();
    expect(screen.queryByText('Modal children')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('click me'));
    expect(await screen.findByText('Modal children')).toBeInTheDocument();
  });
  test('component with children', async () => {
    const store = renderHook(() => useStore({ defaultValues: { str: 'str' } })).result.current;
    render(<ModalIn title='Modal In' value={store.values.str} onChange={v => store.setValues({ str: v })}>
      <Button />
    </ModalIn>);
    expect(screen.getByText('str')).toBeInTheDocument();
    expect(screen.queryByText('Modal In')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('str'));
    expect(screen.getByText('str').textContent).toBe('str');
  });
});

describe('children schema', () => {
  const store = renderHook(() => useStore({ defaultValues: { str: 'str' } })).result.current;

  const triggerRender = (schema: ISchema) => render(<StorePage store={store} schema={schema} components={{
    Avatar, Button, Title: Typography.Title, Trigger, Modal, ModalIn,
  }} />);
  test('base', () => {
    triggerRender({
      type: 'object',
      properties: {
        modal: {
          type: 'void',
          title: 'Modal',
          'x-component': 'Modal',
          'x-component-props': {
            title: 'Modal',
          },
        },
      },
    });
    expect(screen.getByText('Modal')).toBeInTheDocument();
  });
  test('decorator', () => {
    triggerRender({
      type: 'object',
      properties: {
        decorator: {
          type: 'void',
          properties: {
            title: {
              type: 'void',
              'x-component': 'Title',
              'x-component-props': {
                level: 4,
                children: 'decorator 并自定义组件',
              },
            },
            modal: {
              type: 'void',
              'x-decorator': 'Modal',
              'x-decorator-props': {
                title: 'Modal',
                trigger: {
                  component: () => <div>Avatar</div>,
                },
              },
            },
          },
        },
      },
    });
    expect(screen.getByText('decorator 并自定义组件')).toBeInTheDocument();
  });
  test('children', () => {
    triggerRender({
      type: 'object',
      properties: {
        children: {
          type: 'void',
          properties: {
            str: {
              type: 'str',
              title: 'Modal',
              'x-component': 'ModalIn',
              'x-component-props': { title: 'Modal' },
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
    });
    expect(screen.getByText('btn')).toBeInTheDocument();
    fireEvent.click(screen.getByText('btn'));
    expect(screen.getByText('str').textContent).toBe('str');
  });
});
