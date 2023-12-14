import { RecursionField, useFieldSchema } from '@formily/react';
import { ReactNode, useMemo } from 'react';

import { judgeIsEmpty } from '../tools/tool';

export const useAdditionalNode: <T = ReactNode> (propName: string, node?: T) => T | ReactNode = (propName, node) => {
  const { name, additionalProperties } = useFieldSchema() ?? {};
  const schema = additionalProperties?.properties?.[propName];

  return useMemo(() => {
    if (node !== undefined || judgeIsEmpty(schema)) {
      return node;
    }
    return <RecursionField name={name} onlyRenderProperties schema={{ type: 'void', properties: { [propName]: schema } }} />;
  }, [node, schema, name, propName]);
};
