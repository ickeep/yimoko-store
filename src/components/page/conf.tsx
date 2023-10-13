import { Key } from 'react';

import { IStore } from '../../store';
import { IBaseStoreConfig } from '../../store/base';
import { IConfigComponents, NavigateFunction, useRouter } from '../../store/config';
import { IOperateStoreConfig, IRunFn } from '../../store/operate';
import { IFieldsConfig } from '../../store/utils/field';
import { IAPIRequestConfig } from '../../tools/api';
import { IOptions } from '../../tools/options';
import { judgeIsEmpty } from '../../tools/tool';

import { StorePageProps } from './store';

export const getListPath = (config: PageStoreConfig) => {
  const { basePath = '', path } = config;
  const { list = '' } = path ?? {};
  return `${basePath}${list}`;
};

export const getAddPath = (config: PageStoreConfig) => {
  const { basePath = '', path } = config;
  const { add = '/add' } = path ?? {};
  return `${basePath}${add}`;
};

export const getEditPath = (record: Record<Key, any>, config: PageStoreConfig) => {
  const { basePath = '', path, idKey = 'id' } = config;
  const { edit = '/edit' } = path ?? {};
  return `${basePath}${edit}?${idKey}=${record[idKey]}`;
};

export const getDetailPath = (record: Record<Key, any>, config: PageStoreConfig) => {
  const { basePath = '', path, idKey = 'id' } = config;
  const { detail = '/detail' } = path ?? {};
  return `${basePath}${detail}?${idKey}=${record[idKey]}`;
};

export const jumpOnOperateSuccess = (pageProps: OperatePageProps, nav: NavigateFunction) => {
  const { jumpOnSuccess = !pageProps.isBoxContent, storeConfig } = pageProps;
  if (jumpOnSuccess === true) {
    const listPath = getListPath(storeConfig);
    if (listPath) {
      nav(listPath, { replace: true });
    }
  } else if (typeof jumpOnSuccess === 'string' && jumpOnSuccess) {
    nav(jumpOnSuccess, { replace: true });
  }
};

export const useOperateRunAfter = (pageProps: OperatePageProps<any, any>) => {
  const { navigate } = useRouter();
  const { store, parentStore, isRefreshParent = pageProps.isBoxContent, onSuccess, onFail } = pageProps;

  const { runAfter = {} } = store ?? {};
  if (judgeIsEmpty(runAfter.runOnSuccess)) {
    runAfter.runOnSuccess = (...args) => {
      jumpOnOperateSuccess(pageProps, navigate);
      onSuccess?.(...args);
      isRefreshParent && parentStore?.runAPI?.();
    };
  }
  if (judgeIsEmpty(runAfter.runOnFail)) {
    runAfter.runOnFail = (...args) => {
      onFail?.(...args);
    };
  }
  return runAfter;
};


type APIKey =
  'add' | 'edit' | 'detail' | 'del' | 'delOne'
  | 'list' | 'queryOne' | 'query' | 'count'
  | 'getCache' | 'setCache' | 'delCache'
  | 'enableOne' | 'disableOne' | 'enable' | 'disable'
  | Key;

export interface PageBreadcrumbItem {
  label?: string;
  icon?: string;
  url?: string;
  [key: string]: any;
}

export interface PageStoreConfig<V extends object = Record<Key, any>> {
  idKey?: string;
  labelKey?: string;
  basePath?: string
  path?: Record<APIKey, string>
  breadcrumb?: PageBreadcrumbItem[]
  fieldsConfig: IFieldsConfig<V>
  api: Record<APIKey, IAPIRequestConfig>
  map?: Record<Key, Record<Key, any>>
  options?: Record<Key, IOptions<any>>
  components?: IConfigComponents
}

export interface OperatePageProps<T extends object = Record<Key, any>, R extends object = any> extends Omit<StorePageProps, 'store'> {
  values?: T,
  // 数据源的 Store 例如在编辑页面，需要传入详情数据
  dataStore?: IBaseStoreConfig<any, any>,
  storeConfig: PageStoreConfig<T>
  store?: IOperateStoreConfig<T, R>
  parentStore?: IStore
  // 成功后跳转的页面，true为列表页，string为指定页面
  jumpOnSuccess?: string | boolean
  onSuccess?: IRunFn
  onFail?: IRunFn
  // 当弹窗时，成功是否刷新父页面
  isRefreshParent?: boolean
}
