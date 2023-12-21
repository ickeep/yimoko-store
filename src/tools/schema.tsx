import { RecursionField, Schema } from '@formily/react';
import React, { Key } from 'react';

import { judgeIsEmpty } from './tool';

// 用于在有子项项目，例如 menu 之类，获取 schema item 子项配置
// 约定使用 decorator 作为组件名 且 decorator 为空或者等于当前组件名时， decoratorProps 做为组件的 props
export function getItemPropsBySchema(schema: Schema, componentName: string, dataIndex?: number): Record<Key, any> {
  const {
    'x-component': component,
    'x-decorator': decorator,
    'x-decorator-props': decoratorProps = {},
    name,
    ...args
  } = schema;

  const isUseDecoratorProps = !decorator || decorator === componentName;
  // decorator 为空或者等于当前组件名时， decoratorProps 做为组件的 props
  const props = isUseDecoratorProps ? decoratorProps : {};

  // 当组件为空时，只取 props 或者不传 dataIndex 时取 props
  if (judgeIsEmpty(component) || dataIndex === undefined) {
    return props;
  }

  const nameKey = `${dataIndex}.${name}`;

  if (isUseDecoratorProps) {
    return {
      ...decoratorProps,
      children: <RecursionField name={nameKey} schema={{ ...args, name, 'x-component': component }} />,
    };
  }

  return { children: <RecursionField schema={schema} name={nameKey} /> };
};
