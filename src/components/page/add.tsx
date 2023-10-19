import { observer } from '@formily/react';
import { Key, ReactElement } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { IStoreConfig } from '../../store';
import { BaseStore } from '../../store/base';
import { OperateStore } from '../../store/operate';
import { judgeIsEmpty } from '../../tools/tool';

import { OperatePageProps, PageStoreConfig, useOperateRunAfter } from './conf';
import { StorePageProps, StorePage } from './store';

export const AddPage: <T extends object = Record<Key, any>, R extends object = any>(props: OperatePageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const { storeConfig, store, scope, jumpOnSuccess, parentStore, isRefreshParent, onSuccess, onFail, ...rest } = props;
  const { fieldsConfig = {}, api } = (storeConfig ?? {}) as PageStoreConfig<any>;

  const runAfter = useOperateRunAfter(props);

  const curScope = useDeepMemo(() => ({ $config: storeConfig, ...scope }), [storeConfig, scope]);

  const curStore: IStoreConfig = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      store.runAfter = runAfter;
      typeof store.api === 'undefined' && (store.api = api?.add);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }
    return new OperateStore<any>({
      api: api?.add,
      fieldsConfig,
      ...store,
      runAfter,
    });
  }, [api, fieldsConfig, store, runAfter]);

  const curProps: StorePageProps<any, any> = useDeepMemo(() => ({ ...rest, scope: curScope, store: curStore }), [curScope, curStore, rest]);

  return (<StorePage  {...curProps} />);
});
