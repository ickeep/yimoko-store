import { define, observable, action } from '@formily/reactive';
import { ComponentType, createContext, Key, ReactNode, useContext } from 'react';

import { IAPIRequestConfig, IHTTPCode, IHTTPResponse } from '../tools/api';

import { IStoreResponse } from './base';

export const unknownAPIRes = {
  code: IHTTPCode.networkError,
  msg: 'APIContext 未配置',
  data: '',
};

export interface ErrorProps {
  isReturnIndex?: boolean
  loading?: boolean;
  response: IStoreResponse<any, any>;
  onAgain?: () => any | Promise<any>;
  icon?: string
  children?: React.ReactNode
  [key: string]: any
}

export type LoadingComponent = ComponentType<{ loading?: boolean, children?: ReactNode } & Record<Key, any>>;

export type ErrorComponent = ComponentType<ErrorProps>;

export type SkeletonComponent = ComponentType<{ loading?: boolean, children?: ReactNode } & Record<Key, any>>;

export type IConfigComponents = {
  Loading?: LoadingComponent,
  Error?: ErrorComponent,
  Skeleton?: SkeletonComponent,
  [key: string]: ComponentType<any> | undefined
};

export interface IConfigProvider {
  apiExecutor: IAPIExecutor,
  notifier: INotifier,
  useRouter: IUseRouter;
  report?: IReport
  // 依赖的组件
  components?: IConfigComponents
}

export class ConfigStore<T extends object = any> {
  config: T;
  report?: IReport;
  notifier: INotifier;
  apiExecutor: IAPIExecutor;
  // 路由器
  useRouter: IUseRouter;
  components: IConfigComponents;

  constructor(config: T, provider: IConfigProvider) {
    this.config = config;
    const { apiExecutor, notifier, report, useRouter, components = {} } = provider;
    report && (this.report = report);
    this.apiExecutor = apiExecutor;
    this.notifier = notifier;
    this.useRouter = useRouter;
    this.components = components;

    define(this, {
      config: observable,
      setConfig: action,
    });
  }

  logger = (info: Record<Key, any> | Error | unknown, level: ILevel = 'info') => {
    const { report } = this;
    if (report) {
      report(info, level);
    } else {
      console[level]?.(info);
    }
  };

  setConfig = (config: Partial<T>) => this.config = Object.assign(this.config, config);
}

export const ConfigStoreContext = createContext<ConfigStore>(new ConfigStore(
  {},
  {
    apiExecutor: () => Promise.resolve(unknownAPIRes),
    notifier: () => console.log('未配置 notifier'),
    useRouter: () => ({ location: { search: '', hash: '', pathname: '', state: null, key: '' }, navigate: () => { }, params: {} }),
  },
));

export const ConfigStoreProvider = ConfigStoreContext.Provider;

export const ConfigStoreConsumer = ConfigStoreContext.Consumer;

export const useConfigStore = () => useContext(ConfigStoreContext);

export const useLogger = () => useConfigStore().logger;

export const useNotifier = () => useConfigStore().notifier;

export const useAPIExecutor = () => useConfigStore().apiExecutor;

export const useRouter = () => useConfigStore().useRouter();

export const useConfigComponents = () => useConfigStore().components;

export const useConfig = <C extends object = any>() => {
  const store = useConfigStore() as ConfigStore<C>;
  return store.config;
};


type ILevel = 'info' | 'warn' | 'error';

type IReport = (info: Record<Key, any> | Error | unknown, level: ILevel) => void;

type INotifierType = 'success' | 'error' | 'info' | 'warning' | 'loading' | 'warn' | 'open' | 'close' | 'destroy' | 'confirm' | string;

export type INotifier = (type: INotifierType, msg: string | ReactNode, options?: Record<Key, any>) => void;

export type IAPIExecutor = <T extends object = IAPIRequestConfig> (config: T) => Promise<IHTTPResponse>;

export type IUseRouter = () => {
  location: ILocation
  navigate: NavigateFunction
  params: Record<Key, any>
  [key: string]: any
};
export interface Path {
  pathname: string;
  search: string;
  hash: string;
  [key: string]: any;
}

export interface ILocation extends Path {
  state: unknown;
  key: Key;
};

export declare type To = string | Partial<Path>;

export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}
export interface NavigateOptions {
  replace?: boolean;
  state?: any;
  [key: string]: any;
}


