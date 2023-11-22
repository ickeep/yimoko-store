import { RecursionField, useFieldSchema } from '@formily/react';
import { ReactNode, useMemo } from 'react';

import { judgeIsEmpty } from '../tools/tool';

// schema 在多个场景不渲染 children 时，使用该 hook 以保证 properties 能够能够正常渲染 children
export const useChildrenNullishCoalescing = (children?: ReactNode) => {
  const { properties, name } = useFieldSchema() ?? {};
  return useMemo(() => {
    if (!(children === null || children === undefined) || judgeIsEmpty(properties)) {
      return children;
    }
    return <RecursionField name={name} onlyRenderProperties schema={{ type: 'void', properties }} />;
  }, [children, properties, name]);
};
