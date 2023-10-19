import { observer } from '@formily/react';
import { cloneDeep, pick } from 'lodash-es';
import { Key, ReactElement } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { IStoreConfig } from '../../store';
import { BaseStore } from '../../store/base';
import { judgeIsEmpty } from '../../tools/tool';

import { OperatePageProps, useOperateRunAfter } from './conf';
import { FetchDetailPage } from './detail';
import { StorePage } from './store';

export const EditPage: <T extends object = Record<Key, any>, R extends object = any>(props: OperatePageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const {
    values, dataStore, storeConfig, store, scope,
    onSuccess, onFail, parentStore, isRefreshParent, jumpOnSuccess, ...rest
  } = props;
  const { fieldsConfig, api } = storeConfig;
  const curScope = useDeepMemo(() => ({ $config: storeConfig, ...scope }), [storeConfig, scope]);
  const runAfter = useOperateRunAfter(props);

  const curStore: IStoreConfig = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      store.runAfter = runAfter;
      typeof store.api === 'undefined' && (store.api = api?.edit);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }
    return ({
      type: 'operate',
      api: api?.edit,
      fieldsConfig,
      ...store,
      runAfter,
    });
  }, [api, fieldsConfig, store, runAfter]);

  const curStoreProps = useDeepMemo(() => (judgeIsEmpty(values) ? { store: {} } : ({
    ...rest,
    scope: curScope,
    store: curStore instanceof BaseStore ? curStore : {
      ...curStore,
      defaultValues: store && !judgeIsEmpty(store?.defaultValues) ? pick(values, Object.keys(store.defaultValues)) : cloneDeep(values),
    },

  })), [rest, curScope, curStore, store?.defaultValues, values]);


  if (!judgeIsEmpty(values)) {
    return (
      <StorePage  {...curStoreProps} />
    );
  }

  // @ts-ignore
  return <FetchDetailPage {...props} store={curStore} scope={curScope} />;
});
