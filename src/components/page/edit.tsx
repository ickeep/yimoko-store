import { observer } from '@formily/react';
import React, { Key, ReactElement } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { BaseStore } from '../../store/base';
import { OperateStore } from '../../store/operate';
import { judgeIsEmpty } from '../../tools/tool';

import { OperatePageProps, PageStoreConfig, useOperateRunAfter } from './conf';
import { FetchDetailPage, ValuesPage } from './detail';


export const EditPage: <T extends object = Record<Key, any>, R extends object = any>(props: OperatePageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const {
    values, dataStore, storeConfig, store, scope,
    onSuccess, onFail, parentStore, isRefreshParent, jumpOnSuccess, ...rest
  } = props;
  const { fieldsConfig = {}, api } = (storeConfig ?? {}) as PageStoreConfig<any>;
  const curScope = useDeepMemo(() => ({ $config: storeConfig, ...scope }), [storeConfig, scope]);
  const runAfter = useOperateRunAfter(props);

  const curStore = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      store.runAfter = runAfter;
      typeof store.api === 'undefined' && (store.api = api?.edit);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }
    return new OperateStore({
      api: api?.edit,
      fieldsConfig,
      ...store,
      runAfter,
    });
  }, [api, fieldsConfig, store, runAfter]);

  if (!judgeIsEmpty(values)) {
    return (<ValuesPage  {...rest} values={values} store={curStore} scope={curScope} />);
  }

  return <FetchDetailPage {...props} store={curStore} scope={curScope} />;
});
