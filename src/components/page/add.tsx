import { observer } from '@formily/react';
import { cloneDeep } from 'lodash-es';
import React, { Key, ReactElement } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { IStoreConfig } from '../../store';
import { BaseStore } from '../../store/base';
import { OperateStore } from '../../store/operate';
import { judgeIsEmpty } from '../../tools/tool';

import { OperatePageProps, PageStoreConfig, useOperateRunAfter } from './conf';
import { StorePage } from './store';

export const AddPage: <T extends object = Record<Key, any>, R extends object = any>(props: OperatePageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const { config, store, jumpOnSuccess, parentStore, isRefreshParent, onSuccess, onFail, ...rest } = props;
  const { fieldsConfig = {}, api, defaultValues } = (config ?? {}) as PageStoreConfig<any>;

  const runAfter = useOperateRunAfter(props);

  const curStore: IStoreConfig = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      store.runAfter = runAfter;
      typeof store.api === 'undefined' && (store.api = api?.add);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }
    let curDefaultValues = store?.defaultValues ?? {};
    if (!judgeIsEmpty(defaultValues)) {
      curDefaultValues = { ...cloneDeep(defaultValues), ...curDefaultValues };
    }
    return new OperateStore<any>({
      api: api?.add,
      fieldsConfig,
      ...store,
      defaultValues: curDefaultValues,
      runAfter,
    });
  }, [api, fieldsConfig, store, runAfter, defaultValues]);

  return (<StorePage  {...rest} config={config} store={curStore} />);
});
