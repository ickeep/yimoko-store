import { observer, RecursionField, Schema } from '@formily/react';
import { cloneElement, Component, FC, isValidElement, ReactNode } from 'react';
import { isFragment, isValidElementType } from 'react-is';

import { useSchemaComponents } from '../context/schema-components';
import { judgeIsEmpty } from '../tools/tool';

export interface TriggerProps extends React.HTMLAttributes<unknown> {
  // 子组件 如存在会进行拦截,当子组件的 children 为空时，使用 text
  // 子组件会判断是 jsx 模式 还是 schema 模式 分别处理
  // 当子组件为 Fragment 时，会对第一层的子组件分别进行拦截进行处理
  children?: ReactNode
  // 触发事件
  onTrig?: (...args: any) => any | Promise<any>,
  // 触发事件类型
  trigEvent?: 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur' | string
  // 当 children 为空时，使用 text
  text?: ReactNode
  // 默认组件 当 render children 为 undefined 时，使用 component,component也为空时 使用 span
  component?: FC<any> | Component<any, any> | string
  [key: string]: any
}

// eslint-disable-next-line complexity
export const Trigger: FC<TriggerProps> = observer((props) => {
  const { onTrig, trigEvent = 'onClick', children, text, component, ...args } = props;
  const schemaComponents = useSchemaComponents();

  const eventProps: Record<string, any> = {
    [trigEvent]: (...rest: any) => {
      onTrig?.(...rest);
      const event = args?.[trigEvent];
      typeof event === 'function' && event(...rest);
    },
  };

  // eslint-disable-next-line complexity
  const handleChildren = (node: ReactNode, key?: string): ReactNode => {
    if (typeof node === 'string') {
      return node;
    }
    if (Array.isArray(node)) {
      const arr = (node.map((item, i) => handleChildren(item, (key ? `${key}-` : '') + i)).filter(item => item !== undefined));
      return (arr.length === 1) ? arr[0] : arr;
    }
    if (isFragment(node)) {
      return handleChildren(node?.props?.children, key);
    }
    if (isValidElement(node)) {
      const nodeProps = { key, ...eventProps } as any;
      const oldProps = node.props as Record<string, any> | undefined;
      // 判断是否是在 schema 模式下使用
      const judgeSchema = (props: any) => {
        if (judgeIsEmpty(oldProps)) {
          return false;
        }
        const keys = Object.keys(props).sort();
        if (keys.join(',') !== 'basePath,name,schema') {
          return false;
        }
        return props.schema instanceof Schema;
      };

      if (oldProps && judgeSchema(oldProps)) {
        const { schema } = oldProps;
        if (!schema['x-decorator']) {
          schema['x-decorator'] = 'Trigger';
        }
        if (schema['x-decorator'] = 'Trigger') {
          schema['x-decorator-props'] = { ...props, ...schema['x-decorator-props'], children: undefined };
        }
        return node;
      }

      // eslint-disable-next-line eqeqeq
      if (node.type == RecursionField) {
        const nodeProps = node.props as any;
        return (
          <RecursionField
            {...nodeProps}
            // name = text 强制更新  RecursionField
            name={text}
            schema={{
              type: 'void',
              properties: {
                trigger: {
                  type: 'void',
                  'x-decorator': 'Trigger',
                  'x-decorator-props': { ...props, children: undefined },
                  properties: {
                    [nodeProps.name]: nodeProps.schema,
                  },
                },
              },
            }}
          />
        );
      }

      if (oldProps?.children === undefined) {
        nodeProps.children = props.text;
      }
      return cloneElement(node, { ...nodeProps });
    }
    return node;
  };

  const renderChildren = handleChildren(children);

  if (!['string', 'undefined'].includes(typeof renderChildren)) {
    return <>{renderChildren}</>;
  }


  const cProps = { ...args, ...eventProps, children: children ?? text };

  if (component) {
    let C: any;
    if (typeof component === 'string') {
      C = schemaComponents?.[component];
    } else {
      C = component;
    };
    if (isValidElementType(component)) {
      return <C {...cProps} />;
    }
  }

  return <span {...cProps} />;
});
