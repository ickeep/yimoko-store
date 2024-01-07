import { ISchema } from '@formily/react';
import { Key, ReactNode } from 'react';

import { IToNumberOption } from '../../tools/num';
import { DF_KEYS, IKeys } from '../../tools/options';
import { JSONParse, JSONStringify } from '../../tools/tool';
import { BaseStore, IField } from '../base';

export const getSearchParamByValue = (value: any) => (typeof value === 'object' ? JSONStringify(value) : value?.toString?.() ?? '');

export const getValueBySearchParam = (searchParam?: string, schema: ISchema = {}, dfValue: any = '') => {
  const { type = Array.isArray(dfValue) ? 'array' : typeof dfValue } = schema;
  if (typeof searchParam !== 'string') {
    return searchParam;
  }
  const typeFnMap: Record<string, Function> = {
    number: (value: string) => Number(value),
    bigint: (value: string) => BigInt(value),
    boolean: (value: string) => value === 'true',
    object: (value: string) => JSONParse(value),
    array: (value: string) => {
      const arr = JSONParse(value, []);
      return Array.isArray(arr) ? arr : [];
    },
    void: () => undefined,
  };
  const typeFn = typeFnMap[type];
  return typeFn ? typeFn(searchParam) : searchParam;
};

export const getFieldSplitter = (field: IField<any>, store: BaseStore<any, any>) => {
  const { fieldsConfig } = store;
  return fieldsConfig?.[field]?.['x-component-props']?.splitter ?? ',';
};


export const getFieldChildrenKey = (field: IField<any>, store: BaseStore<any, any>): string | undefined => {
  const { fieldsConfig } = store;
  return fieldsConfig?.[field]?.['x-component-props']?.childrenKey;
};

export const getFieldType = (field: IField<any>, store: BaseStore<any, any>) => {
  const { fieldsConfig, defaultValues } = store;
  const type = fieldsConfig?.[field]?.type;
  if (type) {
    return type;
  }
  const df = defaultValues[field];
  if (Array.isArray(df)) {
    return 'array';
  };
  const valType = typeof df;
  if (valType !== 'undefined') {
    return valType;
  }
  return undefined;
};

export const getFieldIsMultiple = (field: IField<any>, store: BaseStore<any, any>) => {
  const mode = store.fieldsConfig?.[field]?.['x-component-props']?.mode;
  return !!(mode && ['multiple', 'tags'].includes(mode));
};

export const getFieldKeys = (field: IField<any>, store: BaseStore<any, any>) => {
  const { fieldsConfig } = store;
  return { ...DF_KEYS, ...fieldsConfig?.[field]?.['x-component-props']?.keys };
};

// 提示 用于字段作用的提示，可以字段级定义，或者在 column, desc 里定义
type ITooltip = ReactNode | ({ icon?: ReactNode, title?: ReactNode, [key: Key]: any });

type IAutoSorter = ({
  autoSorter?: 'percentage' | 'date' | 'time' | 'length';
}) | ({
  autoSorter?: 'string', sorterParams?: 'zh' | any,
}) | ({
  autoSorter?: 'number', sorterParams?: IToNumberOption;
});

export type IFieldConfig<C extends object = Record<Key, any>, D extends object = Record<Key, any>> = ISchema<any> & {
  // 字段的提示
  tooltip?: ITooltip
  // 用于配置表格列的属性 列表页
  column?: C & {
    tooltip?: ITooltip,
    autoFilter?: boolean;
    isFilterContains?: boolean,
    filterSplitter?: string
    // 取 store dict 时 使用 filterKeys 进行转换
    filterKeys?: IKeys<'text' | 'value'>;
    schema?: ISchema,
    [key: Key]: any;
  } & IAutoSorter
  // 用于配置描述列表的属性 详情页
  desc?: Partial<D> & Record<Key, any> & { schema?: ISchema, tooltip?: ITooltip }
};


export type IFieldsConfig<
  P extends object = Record<Key, any>,
  C extends object = Record<Key, any>,
  D extends object = Record<Key, any>>
  = Record<keyof P | string, IFieldConfig<C, D>>;

export type IGetFields<P extends object = Record<Key, any>> = (fieldNames: IFieldNames<P>, config: IFieldsConfig) => ISchema[];

export type IFieldNames<P extends object = Record<Key, any>> = ((ISchema & { name: string }) | keyof P | string)[];
