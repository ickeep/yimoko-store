import { observer } from '@formily/react';
import { Key } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { IStoreConfig } from '../../store';
import { BaseStore } from '../../store/base';
import { judgeIsEmpty } from '../../tools/tool';

import { getAddPath, getDetailPath, getEditPath, PageStoreConfig } from './conf';
import { StorePageProps, StorePage } from './store';

export interface ListPageProps extends Omit<StorePageProps, 'store'> {
  storeConfig: PageStoreConfig
  store: IStoreConfig
}

export const ListPage = observer((props: ListPageProps) => {
  const { storeConfig, store, scope, ...rest } = props;
  const { fieldsConfig, api } = storeConfig;

  const curStore: IStoreConfig = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      typeof store.api === 'undefined' && (store.api = api?.list);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }
    return ({
      type: 'list',
      api: api?.list,
      fieldsConfig,
      ...store,
    });
  }, [api, fieldsConfig, store]);

  return (
    <StorePage
      scope={{
        $config: storeConfig,
        getAddPath: () => getAddPath(storeConfig),
        getEditPath: (record: Record<Key, any>) => getEditPath(record, storeConfig),
        getDetailPath: (record: Record<Key, any>) => getDetailPath(record, storeConfig),
        ...scope,
      }}
      {...rest}
      store={curStore}
    />);
});
