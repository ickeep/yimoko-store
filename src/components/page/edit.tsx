import { observer } from '@formily/react';
import { cloneDeep } from 'lodash-es';
import React, { Key, ReactElement } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { BaseStore } from '../../store/base';
import { OperateStore } from '../../store/operate';
import { judgeIsEmpty } from '../../tools/tool';

import { OperatePageProps, PageStoreConfig, useOperateRunAfter } from './conf';
import { FetchDetailPage, ValuesPage } from './detail';


export const EditPage: <T extends object = Record<Key, any>, R extends object = any>(props: OperatePageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const {
    values, dataStore, config, store,
    onSuccess, onFail, parentStore, isRefreshParent, jumpOnSuccess, ...rest
  } = props;
  const { fieldsConfig = {}, api, defaultValues, idKey = 'id' } = (config ?? {}) as PageStoreConfig<any>;
  const runAfter = useOperateRunAfter(props);

  const curStore = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      store.runAfter = runAfter;
      typeof store.api === 'undefined' && (store.api = api?.edit);
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      return store;
    }
    let curDefaultValues = store?.defaultValues ?? {};
    if (!judgeIsEmpty(defaultValues)) {
      curDefaultValues = { [idKey]: '', ...cloneDeep(defaultValues), ...curDefaultValues };
    }
    return new OperateStore<any>({
      api: api?.edit,
      fieldsConfig,
      ...store,
      defaultValues: curDefaultValues,
      runAfter,
    });
  }, [api, fieldsConfig, store, runAfter, defaultValues, idKey]);

  if (!judgeIsEmpty(values)) {
    return (<ValuesPage  {...rest} values={values} store={curStore} config={config} />);
  }

  return <FetchDetailPage {...props} store={curStore} config={config} />;
});
