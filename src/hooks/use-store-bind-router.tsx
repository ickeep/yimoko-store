import { useForm } from '@formily/react';
import { cloneDeep, isEqual } from 'lodash-es';
import { Key, useCallback, useEffect, useRef } from 'react';

import { IStore } from '../store';

export const useStoreBindRouter = (store: IStore, search: string | Partial<Record<Key, any>>, params?: Record<Key, any>) => {
  const form = useForm();
  const isNotFirst = useRef(false);
  const { isRunNow } = store;

  const getIsRun = useCallback((hasChanged: boolean) => {
    const isFirst = !isNotFirst.current;
    isNotFirst.current = true;

    let bool = false;
    if (!hasChanged) {
      bool = isFirst && isRunNow;
    } else {
      bool = isRunNow || !isFirst;
    }

    return bool;
  }, [isRunNow]);

  useEffect(() => {
    const { isBindRouter, values, setValuesByRouter, runAPI } = store;
    if (isBindRouter) {
      const oldValues = cloneDeep(values);
      setValuesByRouter(search, params, 'all');
      const hasChanged = !isEqual(oldValues, store.values);

      // 列表页 search 参数变化，则重新请求数据
      const handleRun = () => {
        if (getIsRun(hasChanged)) {
          if (form) {
            form.submit().then(() => runAPI());
          } else {
            runAPI();
          }
        }
      };
      handleRun();
    }
  }, [form, getIsRun, params, search, store]);
};
