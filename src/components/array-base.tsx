import { ArrayField } from '@formily/core';
import { useField, useFieldSchema, Schema } from '@formily/react';
import { createContext, useContext } from 'react';

const ArrayBaseContext = createContext<IArrayBaseContext>(null as any);

const ArrayItemContext = createContext<IArrayBaseItemProps>(null as any);

export const ArrayBase: React.FC<React.PropsWithChildren<IArrayBaseProps>> = (props) => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  return (
    <ArrayBaseContext.Provider value={{ field, schema, props }}>
      {props.children}
    </ArrayBaseContext.Provider>
  );
};

export const ArrayBaseItem: React.FC<React.PropsWithChildren<IArrayBaseItemProps>> = ({ children, ...rest }) => (
  <ArrayItemContext.Provider value={rest}>{children}</ArrayItemContext.Provider>
);

const takeRecord = (val: any, index?: number) => (typeof val === 'function' ? val(index) : val);

export const useArray = () => useContext(ArrayBaseContext);

export const useIndex = (index?: number) => {
  const ctx = useContext(ArrayItemContext);
  return ctx ? ctx.index : index;
};

export const useRecord = (record?: number) => {
  const ctx = useContext(ArrayItemContext);
  return takeRecord(ctx ? ctx.record : record, ctx?.index);
};

export interface IArrayBaseContext {
  props: IArrayBaseProps
  field: ArrayField
  schema: Schema
}

export interface IArrayBaseProps {
  disabled?: boolean
  onAdd?: (index: number) => void
  onCopy?: (index: number) => void
  onRemove?: (index: number) => void
  onMoveDown?: (index: number) => void
  onMoveUp?: (index: number) => void
}

export interface IArrayBaseItemProps {
  index: number
  record: ((index: number) => Record<string, any>) | Record<string, any>
}

