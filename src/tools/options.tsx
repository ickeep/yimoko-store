// 选项(如下拉选择组件)数据处理
import { omit } from 'lodash-es';
import { Key } from 'react';

import { strToArr } from '../tools/str';

import { judgeIsEmpty } from './tool';

export const DF_KEYS: IKeys = { label: 'label', value: 'value' };

export function arrToOptions<T extends string = 'label' | 'value'>(options: IOptions<T> = [], keys?: IKeys<T>, childrenKey?: string): IOptions<T> {
  if (!keys) {
    return options;
  }
  const optionsKeys: string[] = [];
  const optionsValues: any[] = [];
  Object.entries(keys).forEach(([key, value]) => {
    if (key !== value) {
      optionsKeys.push(key);
      optionsValues.push(value);
    }
  });

  if (judgeIsEmpty(optionsKeys)) {
    return options;
  }

  if (childrenKey && !optionsKeys.includes(childrenKey)) {
    optionsKeys.push(childrenKey);
  }

  return options?.map((item) => {
    const newItem: Record<string, any> = omit(item, optionsValues);
    // eslint-disable-next-line complexity
    optionsKeys.forEach((key) => {
      const val = item[keys[key] ?? key];
      if (val !== undefined || newItem[key] !== undefined) {
        if (childrenKey && childrenKey === key) {
          if (Array.isArray(val)) {
            newItem[key] = arrToOptions(val, keys, childrenKey);
          } else if (typeof val === 'object') {
            newItem[key] = objToOptions(val, keys, childrenKey);
          } else {
            newItem[key] = [];
          }
        } else {
          newItem[key] = val;
        }
      }
    });
    return newItem as IOption<T>;
  });
};

export const strToOptions = <T extends string = 'label' | 'value'>(str = '', splitter = ',', keys?: IKeys<T>): IOptions<T> => {
  const optionKeys = Object.keys(keys ?? { label: '', value: '' }) as T[];
  const arr = strToArr(str, splitter);

  return arr.map((item) => {
    const option: Record<string, string> = {};
    optionKeys.forEach((key: any) => option[key] = item);
    return option as IOption<T>;
  });
};

export const objToOptions = <T extends string = 'label' | 'value'>(obj: Record<Key, any> = {}, keys?: IKeys<T>, childrenKey?: string): IOptions<T> => {
  const options = !obj ? [] : Object.entries(obj).map(([key, value]) => {
    if (value && typeof value === 'object') {
      return { value: key, ...value };
    }
    return { value: key, label: value?.toString?.() ?? key };
  });
  return arrToOptions(options, keys, childrenKey);
};

// 当 childrenKey 存在时，进行递归处理
export const dataToOptions = <T extends string = 'label' | 'value'>(data?: any, keys?: IKeys<T>, splitter = ',', childrenKey?: string): IOptions<T> => {
  if (Array.isArray(data)) {
    return arrToOptions(data, keys, childrenKey);
  }

  if (typeof data === 'string') {
    return strToOptions(data, splitter, keys);
  }

  if (typeof data === 'object') {
    return objToOptions(data, keys, childrenKey);
  }
  return [];
};

export const judgeValueInOptions = (value: any, options: IOptions<'value'>, keys?: IKeys<'value'>, childrenKey?: string): boolean => {
  const key = keys?.value ?? 'value';
  const isSome = (val: any, arr: IOptions<'value'>) => arr?.some((option) => {
    if (option[key] === val) {
      return true;
    }
    if (childrenKey && option[childrenKey]) {
      return judgeValueInOptions(value, option[childrenKey], keys, childrenKey);
    }
    return false;
  });
  if (Array.isArray(value)) {
    return value.every(item => isSome(item, options));
  }
  return isSome(value, options);
};


export const optionsToMap = <T extends Key = Key>(options: IOptions, keys?: { value?: string, label?: string }) => {
  const map: Record<T, any> = Object({});
  const valueKey = keys?.value ?? 'value' as T;
  const labelKey = keys?.label ?? 'label';
  if (!Array.isArray(options)) {
    return options;
  }
  options.forEach(option => map[option[valueKey]] = option[labelKey]);
  return map;
};


export type IOptions<T extends Key = 'label' | 'value'> = Array<IOption<T>>;


export type IOption<T extends Key = 'label' | 'value'> = { [key in T]?: any } & { [key: string]: any };


export type IKeys<T extends Key = 'label' | 'value'> = { [key in T | string]: string };
