import { observer } from '@formily/reactive-react';
import { Key, useEffect, useMemo } from 'react';


import { useBaseStore } from '../../hooks/use-base-store';
import { useCurStore } from '../../hooks/use-cur-store';

import { JSONParse, judgeIsEmpty } from '../../tools/tool';

import { AddPage } from './add';
import { PageStoreConfig } from './conf';
import { DetailPage } from './detail';
import { EditPage } from './edit';
import { ListPage } from './list';

import { StorePageProps, StorePage } from './store';


export interface RemotePageProps extends Omit<StorePageProps, 'store'> {
  path?: string;
  pathPrefix?: string;
  [key: Key]: any;
}

const pageMap = {
  add: AddPage,
  edit: EditPage,
  detail: DetailPage,
  list: ListPage,
};

export const RemotePage = observer((props: RemotePageProps) => {
  const { path, pathPrefix = 'pc:', ...rest } = props;
  const pathname = 'xxxx';
  // const { pathname } = useLocation();
  const curPath = useMemo(() => pathPrefix + (path ?? pathname), [path, pathPrefix, pathname]);
  const parentStore = useCurStore();
  const pathStore = useBaseStore<{ path: string }, PageConfig>({
    defaultValues: { path: curPath },
    api: { url: '/console-service/frontEnd/page/getCache' },
  });

  const { runAPIByField, response, loading } = pathStore;
  useEffect(() => {
    runAPIByField('path', curPath);
  }, [runAPIByField, curPath]);

  const { data } = response;

  const storeConfig = useMemo(() => {
    const storeStr = data?.store?.content;
    return (judgeIsEmpty(storeStr) ? {} : JSONParse(storeStr)) as PageStoreConfig;
  }, [data]);

  const pageConfig = useMemo(() => {
    const pageStr = data?.content;
    return (judgeIsEmpty(pageStr) ? {} : JSONParse(pageStr)) as { type: keyof typeof pageMap } & StorePageProps;
  }, [data]);

  const { type, ...pageProps } = pageConfig;

  const Page = useMemo(() => pageMap[type] ?? StorePage, [type]);

  return (
    <StorePage store={pathStore}>
      <>
        {/* <StorePageContent> */}
        {/* 强制重新渲染 */}
        {loading
          ? 'loading'
          // @ts-ignore
          : <Page parentStore={parentStore} {...rest} {...pageProps} storeConfig={storeConfig} />
        }
        {/* </StorePageContent> */}
      </>
    </StorePage>
  );
});

export interface PageConfig {
  id: string
  updateTime: string
  createTime: string
  path: string
  name: string
  content: string
  desc: string
  storeID: string
  store: {
    id: string
    updateTime: string
    createTime: string
    name: string
    content: string
    desc: string
  }
}
