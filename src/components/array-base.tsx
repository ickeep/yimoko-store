import { ArrayField } from '@formily/core';
import { useField, useFieldSchema, Schema, RecursionField, RecordsScope, RecordScope, observer } from '@formily/react';
import { clone, omitBy } from 'lodash-es';
import { Key, ReactElement, createContext, useContext, useMemo } from 'react';

import { judgeIsEmpty } from '../tools/tool';

const ArrayBaseContext = createContext<IArrayBaseContext>(null as any);

export const ArrayBase: React.FC<React.PropsWithChildren<IArrayBaseProps>> = (props) => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  const disabled = props?.disabled ?? field?.disabled;
  const isForceUpdate = props.isForceUpdate ?? false;

  const newProps: Required<IArrayBaseProps> = useMemo(() => {
    const forceUpdate = () => {
      isForceUpdate && field.setValue(field.value.slice());
    };
    return {
      disabled,
      isForceUpdate,
      onPush: (...items: any[]) => {
        props?.onPush?.(...items);
        const result = field.push(...items);
        forceUpdate();
        return result;
      },
      onPop: () => {
        props?.onPop?.();
        const result = field.pop();
        forceUpdate();
        return result;
      },
      onInsert: (index: number, ...items: any[]) => {
        props?.onInsert?.(index, ...items);
        const result = field.insert(index, ...items);
        forceUpdate();
        return result;
      },
      onRemove: (index: number) => {
        props?.onRemove?.(index);
        const result = field.remove(index);
        forceUpdate();
        return result;
      },
      onShift: () => {
        props?.onShift?.();
        const result = field.shift();
        forceUpdate();
        return result;
      },
      onUnshift: (...items: any[]) => {
        props?.onUnshift?.(...items);
        const result = field.unshift(...items);
        forceUpdate();
        return result;
      },
      onMove: (fromIndex: number, toIndex: number) => {
        props?.onMove?.(fromIndex, toIndex);
        const result = field.move(fromIndex, toIndex);
        forceUpdate();
        return result;
      },
      onMoveUp: (index: number) => {
        props?.onMoveUp?.(index);
        const result = field.moveUp(index);
        forceUpdate();
        return result;
      },
      onMoveDown: (index: number) => {
        props?.onMoveDown?.(index);
        const result = field.moveDown(index);
        forceUpdate();
        return result;
      },
    };
  }, [disabled, field, isForceUpdate, props]);

  return (
    <ArrayBaseContext.Provider value={{ field, schema, props: newProps }}>
      {props.children}
    </ArrayBaseContext.Provider>
  );
};


export const ArrayRender: <T>(props: IArrayRenderProps<T>) => ReactElement<any, any> | null = observer((props) => {
  const { value, data, children, isRenderProperties } = props;
  const curData = data ?? value ?? [];

  const field = useField();
  const schema = useFieldSchema();
  const { items } = schema ?? {};

  const curChildren = useMemo(() => {
    if (children !== undefined) {
      return children;
    }
    if (!isRenderProperties || judgeIsEmpty(schema.properties)) {
      return null;
    }
    // 默认 schema type 为 array 不渲染 properties, 表格这里特意做加强
    return <RecursionField name={schema.name} onlyRenderProperties schema={{ type: 'void', properties: schema.properties }} />;
  }, [children, isRenderProperties, schema.name, schema.properties]);

  if (judgeIsEmpty(items)) {
    return <>{curChildren}</>;
  }
  return (
    <RecordsScope getRecords={() => curData}>
      <ArrayBase disabled={field.disabled} isForceUpdate={true}  >
        {curData.map((record, index) => (
          <RecordScope getRecord={() => record} getIndex={() => index} key={index}>
            <RecursionField name={index} schema={Array.isArray(items) ? (items[index] ?? items[0]) : items} />
          </RecordScope>
        ))}
        {curChildren}
      </ArrayBase>
    </RecordsScope>
  );
});

export const useArray = () => useContext(ArrayBaseContext);

export type IPropsMapping = Partial<Record<keyof Omit<IArrayBaseProps, 'disabled' | 'isForceUpdate' | 'onMoveUp' | 'onMoveDown'>, string>>;

// 返回组件的 props 增加字段 arrayParams
type ICProps<T extends Object = Record<Key, any>, R = any> = T & { arrayParams?: { index?: number, toIndex?: number, items?: R[] } };

export function withArrayComponent<T extends Object = Record<Key, any>, R = any>(
  C: React.ComponentClass<T> | React.FunctionComponent<T>,
  propsMapping?: IPropsMapping,
  defaultProps?: Partial<T>,
) {
  return (props: ICProps<T, R>) => {
    const { arrayParams, ...rest } = props;
    const arrayCtx = useArray();
    const arrProps = arrayCtx.props;
    const { index = 0, toIndex = 0, items = [] } = arrayParams ?? {};
    const curProps = useMemo(() => {
      if (judgeIsEmpty(propsMapping)) {
        return rest;
      }
      const valueKeys = Object.values(propsMapping);
      const cProps = omitBy(rest, (v, k) => !valueKeys.includes(k as any) || v === undefined);
      const emit = (key: keyof IPropsMapping, ...args: any[]) => {
        const name = propsMapping[key];
        name && (rest as any)?.[name]?.(...args);
      };
      const fnMap: Record<keyof IPropsMapping, (...args: any) => any> = {
        onPush: (...args) => {
          emit('onPush', items, ...args);
          arrProps.onPush(...items);
        },
        onPop: (...args) => {
          emit('onPop', ...args);
          arrProps.onPop();
        },
        onInsert: (...args) => {
          emit('onInsert', index, items, ...args);
          arrProps.onInsert(index, ...items);
        },
        onRemove: (...args) => {
          emit('onRemove', index, ...args);
          arrProps.onRemove(index);
        },
        onShift: (...args) => {
          emit('onShift', ...args);
          arrProps.onShift();
        },
        onUnshift: (...args) => {
          emit('onUnshift', items, ...args);
          arrProps.onUnshift(...items);
        },
        onMove: (...args) => {
          emit('onMove', index, toIndex, ...args);
          arrProps.onMove(index, toIndex);
        },
      };
      (Object.keys(propsMapping) as Array<keyof IPropsMapping>).forEach((key) => {
        const name = propsMapping[key] as keyof unknown;
        const fn = fnMap[key] as any;
        cProps[name] = fn;
      });
      return cProps;
    }, [arrProps, index, items, rest, toIndex]);

    // @ts-ignore
    return <C {...defaultProps} {...curProps} />;
  };
}

export type IPropsMappingItem = Partial<Record<keyof Pick<IArrayBaseProps, 'onRemove' | 'onMoveUp' | 'onMoveDown'> | 'onCopy', string>>;


export function withArrayItemComponent<T extends Object = Record<Key, any>>(
  C: React.ComponentClass<T> | React.FunctionComponent<T>,
  propsMapping?: IPropsMappingItem,
  defaultProps?: Partial<T>,
) {
  return (props: T) => {
    const arrayCtx = useArray();
    const arrField = arrayCtx.field;
    const arrProps = arrayCtx.props;
    const field = useField();

    const curProps = useMemo(() => {
      if (judgeIsEmpty(propsMapping)) {
        return props;
      }
      const valueKeys = Object.values(propsMapping);
      const cProps = omitBy(props, (v, k) => !valueKeys.includes(k as any) || v === undefined);
      const emit = (key: keyof IPropsMappingItem, ...args: any[]) => {
        const name = propsMapping[key];
        name && (props as any)?.[name]?.(...args);
      };
      const fnMap: Record<keyof IPropsMappingItem, (...args: any) => any> = {
        onMoveUp: (...args) => {
          const { index } = field;
          emit('onMoveUp', index, ...args);
          arrProps.onMoveUp(index);
        },
        onMoveDown: (...args) => {
          const { index } = field;
          emit('onMoveDown', index, ...args);
          arrProps.onMoveDown(index);
        },
        onRemove: (...args) => {
          const { index } = field;
          emit('onRemove', index, ...args);
          arrProps.onRemove(index);
        },
        onCopy: (...args) => {
          const { index } = field;
          emit('onCopy', index, ...args);
          const value = clone(arrField.value[index]);
          const distIndex = index + 1;
          arrProps.onInsert(distIndex, value);
        },
      };

      (Object.keys(propsMapping) as Array<keyof IPropsMappingItem>).forEach((key) => {
        const name = propsMapping[key] as keyof T;
        const fn = fnMap[key] as any;
        cProps[name] = fn;
      });

      return cProps as T;
    }, [arrField.value, arrProps, field, props]);

    return <C {...defaultProps} {...curProps} />;
  };
}

export interface IArrayBaseContext {
  props: Required<IArrayBaseProps>
  field: ArrayField
  schema: Schema
}

export interface IArrayBaseProps {
  disabled?: boolean
  // 是否强制更新 当组件内部自行管理数据源时，需要触发更新 例如：Table
  isForceUpdate?: boolean
  onPush?: (...items: any[]) => Promise<void>;
  onPop?: () => Promise<void>;
  onInsert?: (index: number, ...items: any[]) => Promise<void>;
  onRemove?: (index: number) => Promise<void>;
  onShift?: () => Promise<void>;
  onUnshift?: (...items: any[]) => Promise<void>;
  onMove?: (fromIndex: number, toIndex: number) => Promise<void>;
  onMoveUp?: (index: number) => Promise<void>;
  onMoveDown?: (index: number) => Promise<void>;
}

export type IArrayRenderProps<T = any> = React.PropsWithChildren<{
  value?: T[]
  data?: T[]
  isRenderProperties?: boolean
}>;
