import { observer, useExpressionScope } from '@formily/react';
import { Key, useMemo } from 'react';

import { IStore } from '../../store';
import { useConfigComponents } from '../../store/config';
import { judgeIsSuccess } from '../../tools/api';
import { judgeIsEmpty } from '../../tools/tool';

export interface StorePageContentProps {
  store?: IStore,
  children?: React.ReactNode
  skeleton?: Record<Key, any> | false
  isReturnIndex?: boolean
  isAgain?: boolean
  load?: Record<Key, any> | boolean
}

export const StorePageContent = observer((props: StorePageContentProps) => {
  const { store, children, skeleton, isReturnIndex, isAgain = true, load = false } = props;
  const components = useConfigComponents();
  const scope = useExpressionScope();
  const pageComponents = scope?.components;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Loading = useMemo(() => (pageComponents?.Loading ?? components?.Loading ?? (() => 'loading')), [components?.Loading, pageComponents?.Loading]);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const Skeleton = useMemo(() => (pageComponents?.Skeleton ?? components?.Skeleton ?? (() => 'loading')), [components?.Skeleton, pageComponents?.Skeleton]);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const ErrorContent = useMemo(() => (pageComponents?.ErrorContent ?? components?.ErrorContent ?? (() => 'error')), [components?.ErrorContent, pageComponents?.ErrorContent]);

  const curStore = useMemo(() => store ?? (scope?.curStore as IStore), [store, scope?.curStore]);

  const { loading, response, runAPI } = curStore ?? {};

  const curOnAgain = useMemo(() => (isAgain ? runAPI : undefined), [isAgain, runAPI]);
  const isSkeleton = useMemo(() => loading && judgeIsEmpty(response) && skeleton !== false, [loading, response, skeleton]);
  const curChildren = useMemo(
    () => (load
      ? <Loading {...(typeof load === 'object' ? load : {})} loading={loading}>{children}</Loading>
      : children)
    , [load, Loading, loading, children],
  );

  if (!curStore || judgeIsSuccess(response)) {
    return <>{curChildren}</>;
  }

  if (isSkeleton) {
    return <Skeleton {...skeleton} />;
  }

  // TODO 考虑是否将 load 属性传至 ErrorContent 以保证 loading 效果一致
  return <ErrorContent response={response} isReturnIndex={isReturnIndex} onAgain={curOnAgain} loading={loading} />;
});
