import { createSchemaField, ISchemaFieldProps, SchemaComponentsContext, SchemaReactComponents, useExpressionScope } from '@formily/react';
import { createContext, FC, useContext } from 'react';

import { useDeepMemo } from '../hooks/use-deep-memo';
import { judgeIsEmpty, useConfigStore } from '../library';


const SchemaField = createSchemaField();

export const SchemaFieldContext = createContext<FC<ISchemaFieldProps>>(SchemaField);

export const SchemaFieldProvider = SchemaFieldContext.Provider;

export const SchemaFieldConsumer = SchemaFieldContext.Consumer;

export const useSchemaField = <Components extends SchemaReactComponents = any>(components?: Components, scope?: any) => {
  const df = useContext(SchemaFieldContext);
  const dfComponents = useContext(SchemaComponentsContext);
  const oldScope = useExpressionScope();
  const configComponents = useConfigStore().components as SchemaReactComponents;

  return useDeepMemo(() => {
    if (judgeIsEmpty(components) && judgeIsEmpty(scope) && df) {
      return df;
    }
    return createSchemaField({ components: { ...configComponents, ...dfComponents, ...components }, scope: { ...oldScope, ...scope } });
  }, [components, scope]);
};
