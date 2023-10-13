import { observer } from '@formily/react';
import { Key, ReactElement } from 'react';

import { useSchemaComponents } from '../../context/schema-components';
import { useDeepMemo } from '../../hooks/use-deep-memo';
import { useStore } from '../../hooks/use-store';
import { IStoreConfig } from '../../store';
import { BaseStore, IBaseStoreConfig } from '../../store/base';

import { judgeIsEmpty } from '../../tools/tool';

import { PageStoreConfig } from './conf';
import { StorePageProps, StorePage } from './store';


export interface DetailPageProps<T extends object = Record<Key, any>, R extends object = any> extends Omit<StorePageProps<any>, 'store'> {
  values?: T,
  dataStore?: IBaseStoreConfig<any, any>,
  storeConfig: PageStoreConfig<T>,
  store?: IStoreConfig<T, R>
}

export const DetailPage = observer((props: DetailPageProps) => {
  const { values, dataStore, storeConfig, store, isBoxContent, scope, ...rest } = props;
  const { fieldsConfig } = storeConfig;
  const curScope = { $config: storeConfig, ...scope };
  const components = useSchemaComponents();

  if (!judgeIsEmpty(values)) {
    return (
      <StorePage
        components={components}
        {...rest}
        scope={curScope}
        store={{
          fieldsConfig,
          ...store,
          defaultValues: { ...values, ...store?.defaultValues },
        }}
      />
    );
  }
  return <FetchDetailPage {...props} scope={curScope} />;
});

export const FetchDetailPage: <T extends object = Record<Key, any>, R extends object = any>(props: DetailPageProps<T, R>) => ReactElement<any, any> | null = observer((props) => {
  const { dataStore, storeConfig } = props;
  const { api, idKey = 'id' } = storeConfig;

  const detailStore = useStore({
    type: 'base',
    isBindRouter: true,
    isRunNow: true,
    api: api?.detail,
    defaultValues: { [idKey]: '' },
    ...dataStore,
  });

  return (
    <StorePage store={detailStore} >
      {/* TODO */}
      {/* <StorePageContent > */}
      <DetailContent {...props} detailStore={detailStore} />
      {/* </StorePageContent> */}
    </StorePage>
  );
});


// eslint-disable-next-line max-len
const DetailContent: <T extends object = Record<Key, any>, R extends object = any> (props: DetailPageProps<T, R> & { detailStore: BaseStore<any, any> }) => ReactElement<any, any> | null = observer((props) => {
  const { values, dataStore, storeConfig, detailStore, store, ...rest } = props;
  const { fieldsConfig } = storeConfig;

  const curStore = useDeepMemo(() => {
    const values: any = { ...store?.defaultValues, ...detailStore.response.data };
    if (store instanceof BaseStore) {
      judgeIsEmpty(store.fieldsConfig) && (store.fieldsConfig = fieldsConfig);
      store.defaultValues = values;
      store.setValues({ ...values });
      return store;
    }
    return ({ fieldsConfig, ...store, values, defaultValues: values });
  }, [store, fieldsConfig, detailStore.response.data]);


  return <StorePage {...rest} store={curStore} />;
});
