import { observer } from '@formily/react';
import { FC, Key, useMemo } from 'react';

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
  storeConfig: PageStoreConfig<T>,
  store?: IStoreConfig<T, R>
}

export type IDetailPage<T extends object = Record<Key, any>, R extends object = any> = FC<DetailPageProps<T, R>>;

export const DetailPage: IDetailPage = observer((props) => {
  if (!judgeIsEmpty(props.values)) {
    return (
      <ValuesDetailPage {...props} />
    );
  }
  return <FetchDetailPage {...props} />;
});

// 当 values 有值时，直接渲染
const ValuesDetailPage: IDetailPage = observer((props) => {
  const { values, dataStore, storeConfig, store, scope, ...rest } = props;
  const { fieldsConfig } = storeConfig;
  const curScope = useMemo(() => ({ $config: storeConfig, ...scope }), [storeConfig, scope]);

  const curStore: IStoreConfig = useDeepMemo(() => {
    if (store instanceof BaseStore) {
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      store.defaultValues = { ...store.defaultValues, ...values };
      store.resetValues();
      return store;
    }
    return ({
      fieldsConfig,
      ...store,
      defaultValues: { ...store?.defaultValues, ...values },
    });
  }, [fieldsConfig, store, values]);

  return (<StorePage  {...rest} scope={curScope} store={curStore} />);
});

export const FetchDetailPage: IDetailPage = observer((props) => {
  const { dataStore, storeConfig, skeleton, scope } = props;
  const { api, idKey = 'id' } = storeConfig;

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
    <StorePage store={curDataStore} >
      <StorePageContent skeleton={skeleton} >
        <ValuesDetailPage {...props} scope={curScope} values={curDataStore?.response?.data} />
      </StorePageContent>
    </StorePage>
  );
});

