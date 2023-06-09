import { Key } from 'react';

import { IHTTPResponse, judgeIsSuccess } from '../tools/api';
import { judgeIsEmpty } from '../tools/tool';

import { BaseStore, IBaseStoreConfig, IStoreValues } from './base';
import { INotifier } from './config';

import { IStore } from '.';

export const defaultRunAfter: IRunAfter = {
  notify: true,
  resetValues: 'success',
};

// 操作 store, 请求 API 默认不过滤空值，默认请求结果后，对其进行通知
export class OperateStore<V extends object = IStoreValues, R extends object = any> extends BaseStore<V, R> {
  notifier?: INotifier;

  runBefore: IRunBefore = { verify: true };
  runAfter: IRunAfter = { ...defaultRunAfter };

  constructor(config: IOperateStoreConfig<V, R> = {}) {
    const { runBefore, runAfter, notifier, ...args } = config;
    super({
      isFilterEmptyAtRun: false,
      ...args,
    });

    notifier && (this.notifier = notifier);
    this.runAfter = { ...this.runAfter, ...runAfter };
    this.runBefore = { ...this.runBefore, ...runBefore };

    const { runAPI } = this;

    this.runAPI = async () => {
      const { form, runBefore, runAfter } = this;
      if (runBefore.verify) {
        try {
          await form?.submit();
        } catch (error) {
          return undefined;
        }
      }
      const res = await runAPI();
      res && handleRunAfter(res, runAfter, this);
      return res;
    };
  }
}


const handleRunAfter = (res: Partial<IHTTPResponse>, runAfter: IRunAfter, store: OperateStore<any, any>) => {
  handleResetValues(res, runAfter, store);
  handleRunAfterRun(res, runAfter, store);
  handleRunAfterNotify(res, runAfter, store);
};

const handleResetValues = (res: Partial<IHTTPResponse>, runAfter: IRunAfter, store: OperateStore<any, any>) => {
  const { resetValues } = runAfter;

  resetValues === true && store.resetValues();
  if (judgeIsSuccess(res)) {
    resetValues === 'success' && store.resetValues();
  } else {
    resetValues === 'fail' && store.resetValues();
  }
};

const handleRunAfterRun = (res: Partial<IHTTPResponse>, runAfter: IRunAfter, store: OperateStore<any, any>) => {
  const { run, runOnFail, runOnSuccess } = runAfter;
  const runFn = (fn: IRunAfter['run']) => typeof fn === 'function' && fn(res, store);
  runFn(run);
  judgeIsSuccess(res) ? runFn(runOnSuccess) : runFn(runOnFail);
};

const handleRunAfterNotify = (res: Partial<IHTTPResponse>, runAfter: IRunAfter, store: OperateStore<any, any>) => {
  const { notify, notifyOnFail = notify, notifyOnSuccess = notify } = runAfter;
  const getMsg = (notify: true | string, df?: string) => {
    const msg = notify === true ? res.msg : notify;
    return judgeIsEmpty(msg) ? df : msg;
  };
  if (judgeIsSuccess(res)) {
    notifyOnSuccess && store.notifier?.('success', getMsg(notifyOnSuccess, '成功了'));
  } else {
    notifyOnFail && store.notifier?.('error', getMsg(notifyOnFail, '出错了'));
  }
};

export interface IOperateStoreConfig<V extends object = IStoreValues, R extends object = any> extends IBaseStoreConfig<V, R> {
  notifier?: INotifier;
  scope?: Record<Key, any>;
  runBefore?: IRunBefore;
  runAfter?: IRunAfter
};

export type IRunFn = (res: Partial<IHTTPResponse>, store: OperateStore<any, any>) => void;

export interface IRunBefore {
  verify?: boolean
}

export interface IRunAfter {
  resetValues?: boolean | 'success' | 'fail';
  notify?: boolean | string
  notifyOnFail?: boolean | string
  notifyOnSuccess?: boolean | string
  run?: IRunFn
  runOnFail?: IRunFn
  runOnSuccess?: IRunFn
}

export enum IOperateFromType {
  add = 'add',
  edit = 'edit',
}
export interface IOperateFromProps<V extends object = any, R extends object = any> {
  defaultValues: IStore<V, R>['defaultValues']
  api?: IStore<V, R>['api']
  type?: IOperateFromType | string;
  isBoxContent?: boolean;
  onSuccess?: (...rest: any) => any
  onFail?: (...rest: any) => any
  onClose?: (...rest: any) => any
}
