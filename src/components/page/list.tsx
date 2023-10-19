import { observer } from '@formily/react';
import { Key, ReactElement } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { ListStore } from '../../library';
import { IStoreConfig } from '../../store';
import { BaseStore, IStoreValues } from '../../store/base';
import { judgeIsEmpty } from '../../tools/tool';

import { getAddPath, getDetailPath, getEditPath, PageStoreConfig } from './conf';
import { StorePageProps, StorePage } from './store';

export interface ListPageProps<V extends object = IStoreValues, R extends object = any> extends Omit<StorePageProps<V, R>, 'store'> {
  storeConfig?: PageStoreConfig;
  store: IStoreConfig<any, any>
}

export const ListPage: <T extends object = Record<Key, any>, R extends object = any>(props: ListPageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const { storeConfig, store, scope, ...rest } = props;
  const { fieldsConfig, api } = (storeConfig ?? {}) as PageStoreConfig<any>;

  const curStore = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      typeof store.api === 'undefined' && (store.api = api?.list);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }
    return new ListStore({
      api: api?.list,
      fieldsConfig,
      ...store,
    });
  }, [api, fieldsConfig, store]);

  const curScope = useDeepMemo(() => ({
    $config: storeConfig,
    getAddPath: () => getAddPath(storeConfig),
    getEditPath: (record: Record<Key, any>) => getEditPath(record, storeConfig),
    getDetailPath: (record: Record<Key, any>) => getDetailPath(record, storeConfig),
    ...scope,
  }), [storeConfig, scope]);

  return (<StorePage  {...rest} scope={curScope} store={curStore} />);
});
