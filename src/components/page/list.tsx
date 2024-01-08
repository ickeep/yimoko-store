import { observer } from '@formily/react';
import { cloneDeep } from 'lodash-es';
import React, { Key, ReactElement } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { ListStore } from '../../library';
import { IStoreConfig } from '../../store';
import { BaseStore, IStoreValues } from '../../store/base';
import { judgeIsEmpty } from '../../tools/tool';

import { getAddPath, getDetailPath, getEditPath, PageStoreConfig } from './conf';
import { StorePageProps, StorePage } from './store';

export interface ListPageProps<V extends object = IStoreValues, R extends object = any> extends Omit<StorePageProps<V, R>, 'store'> {
  store: IStoreConfig<any, any>
}

export const ListPage: <T extends object = Record<Key, any>, R extends object = any>(props: ListPageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const { config, store, scope, ...rest } = props;
  const { fieldsConfig, api, defaultQueryValues } = (config ?? {}) as PageStoreConfig<any>;

  const curStore = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      typeof store.api === 'undefined' && (store.api = api?.list);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }

    let curDefaultValues = store?.defaultValues ?? {};
    if (!judgeIsEmpty(defaultQueryValues)) {
      curDefaultValues = { ...cloneDeep(defaultQueryValues), ...curDefaultValues };
    }
    return new ListStore({
      api: api?.list,
      fieldsConfig,
      ...store,
      defaultValues: curDefaultValues,
    });
  }, [api, fieldsConfig, store, defaultQueryValues]);

  const curScope = useDeepMemo(() => ({
    getAddPath: () => getAddPath(config),
    getEditPath: (record: Record<Key, any>) => getEditPath(record, config),
    getDetailPath: (record: Record<Key, any>) => getDetailPath(record, config),
    ...scope,
  }), [config, scope]);

  return (<StorePage  {...rest} scope={curScope} config={config} store={curStore} />);
});
