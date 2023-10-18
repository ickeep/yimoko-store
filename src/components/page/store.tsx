import { createForm, IFormProps } from '@formily/core';
import { SchemaReactComponents, ISchema, observer } from '@formily/react';
import { useMemo } from 'react';

import { useRoot } from '../../context/root';
import { useStore } from '../../hooks/use-store';
import { IStore, IStoreConfig } from '../../store';

import { IStoreValues } from '../../store/base';
import { useBoxBindContentStore } from '../../store/box';
import { useConfig } from '../../store/config';
import { SchemaPage } from '../schema-page';
import { StoreBindRouter } from '../store-bind-router';
import { StoreDict } from '../store-dict';

export interface StorePageProps<V extends object = IStoreValues, R extends object = any, S extends object = Record<string, any>> extends React.HTMLAttributes<HTMLDivElement> {
  store: IStore<V, R> | IStoreConfig<V, R>;
  options?: Omit<IFormProps<any>, 'values' | 'initialValues'>,
  components?: SchemaReactComponents;
  scope?: any;
  schema?: ISchema
  isBoxContent?: boolean
  skeleton?: S | false
}

export const StorePage: <V extends object = IStoreValues, R extends object = any>(props: StorePageProps<V, R>) => React.ReactElement | null = observer((props) => {
  const { store, options, scope, isBoxContent, ...args } = props;
  const rootStore = useRoot();
  const configStore = useConfig();
  const curStore = useStore(store);
  const model = useMemo(() => createForm({ ...options, values: curStore.values, initialValues: curStore.defaultValues }), [curStore, options]);
  const curScope = useMemo(() => ({ ...scope, curStore, rootStore, configStore }), [configStore, curStore, rootStore, scope]);
  useBoxBindContentStore(curStore, isBoxContent);

  return (
    <>
      <SchemaPage model={model} scope={curScope} {...args} />
      <StoreDict store={curStore} />
      <StoreBindRouter store={curStore} />
    </>
  );
});

