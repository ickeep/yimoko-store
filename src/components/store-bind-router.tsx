import { observer } from '@formily/react';

import { useStoreBindRouter } from '../hooks/use-store-search';
import { IStore } from '../store';
import { useRouter } from '../store/config';

// 使用 hook 会导致使用页面因为 search 而重新渲染，使用组件，则可将影响范围限制在本组件中
export const StoreBindRouter = observer(({ store }: { store: IStore }) => {
  const { location, params } = useRouter();
  useStoreBindRouter(store, location?.search, params);
  return null;
});
