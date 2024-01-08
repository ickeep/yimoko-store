import { observer } from '@formily/react';
import { cloneDeep, pick } from 'lodash-es';
import React, { Key, ReactElement, useMemo } from 'react';

import { useDeepMemo } from '../../hooks/use-deep-memo';
import { IStoreConfig } from '../../store';
import { BaseStore } from '../../store/base';
import { judgeIsEmpty } from '../../tools/tool';

import { PageStoreConfig } from './conf';
import { StorePageProps, StorePage } from './store';
import { StorePageContent } from './store-content';

export interface DetailPageProps<T extends object = Record<Key, any>, R extends object = any> extends Omit<StorePageProps<any>, 'store'> {
  values?: T,
  dataStore?: IStoreConfig<any, any>,
  store?: IStoreConfig<T, R>
  isPickValues?: boolean
}


export const DetailPage: <T extends object = Record<Key, any>, R extends object = any>(props: DetailPageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  if (!judgeIsEmpty(props.values)) {
    return (
      <ValuesPage {...props} />
    );
  }
  return <FetchDetailPage {...props} />;
});


export const FetchDetailPage: <T extends object = Record<Key, any>, R extends object = any>(props: DetailPageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const { dataStore, config, skeleton, scope } = props;
  const { api, idKey = 'id' } = config ?? {};

  const curDataStore = useDeepMemo(() => {
    if (dataStore instanceof BaseStore) {
      return dataStore;
    }
    return new BaseStore({
      isBindRouter: true,
      isRunNow: true,
      api: api?.detail,
      defaultValues: { [idKey]: '' },
      ...dataStore,
    });
  }, [api?.detail, dataStore, idKey]);

  const curScope = useMemo(() => ({ ...scope, dataStore: curDataStore }), [scope, curDataStore]);

  return (
    <StorePage store={curDataStore} config={config} >
      <StorePageContent skeleton={skeleton} >
        <ValuesPage {...props} scope={curScope} config={config} values={curDataStore?.response?.data} />
      </StorePageContent>
    </StorePage>
  );
});

// 当 values 有值时，直接渲染
export const ValuesPage: <T extends object = Record<Key, any>, R extends object = any>(props: DetailPageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const { values, dataStore, config, store, isPickValues = true, ...rest } = props;
  const { fieldsConfig = {} } = (config ?? {}) as PageStoreConfig<any>;

  const curStore: IStoreConfig = useDeepMemo(() => {
    const { defaultValues } = store ?? {};
    const curValues = cloneDeep((isPickValues && !judgeIsEmpty(defaultValues)) ? pick(values, Object.keys(defaultValues)) : values);
    if (store instanceof BaseStore) {
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      store.defaultValues = { ...store.defaultValues, ...curValues };
      store.resetValues();
      return store;
    }
    return ({
      fieldsConfig,
      ...store,
      defaultValues: { ...store?.defaultValues, ...curValues },
    });
  }, [fieldsConfig, store, values]);

  return (<StorePage  {...rest} config={config} store={curStore} />);
});
