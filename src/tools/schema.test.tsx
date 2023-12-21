import { createSchemaField, ISchema, useFieldSchema } from '@formily/react';
import { render, screen } from '@testing-library/react';

import React from 'react';

import { SchemaPage } from '../components/schema-page';
import { SchemaFieldProvider } from '../context/schema-field';

import { getItemPropsBySchema } from './schema';
import { judgeIsEmpty } from './tool';


describe('getItemPropsBySchema', () => {
  const Render = ({ schema }: { schema?: ISchema }) => {
    const components = {
      A: ({ componentName, data }: { componentName: string, schemaKey: string | number, data?: any[] }) => {
        const schema = useFieldSchema();
        const { items } = schema;
        const schemaItem = Array.isArray(items) ? (items[0]) : items;
        if (judgeIsEmpty(schemaItem)) {
          return null;
        }
        return <div>
          {data?.map((item, index) => {
            const { children, ...rest } = getItemPropsBySchema(schemaItem, componentName, index);
            return (
              <div key={index}>
                <div role='children'>{children}</div>
                <div role='rest'>{JSON.stringify(rest)}</div>
              </div>
            );
          })}
        </div>;
      },
    };
    const SchemaField = createSchemaField({ components });
    return (
      <SchemaFieldProvider value={SchemaField}>
        <SchemaPage components={components} schema={schema} />
      </SchemaFieldProvider>
    );
  };


  test('empty', () => {
    render(<Render schema={{
      type: 'object',
      properties: {
        A: {
          'x-component': 'A',
          'x-component-props': { componentName: 'div', data: ['1'] },
        },
      },
    }} />);
    expect(document.body.textContent).toBe('');
  });

  test('children', () => {
    render(<Render schema={{
      type: 'object',
      properties: {
        A: {
          'x-component': 'A',
          'x-component-props': { componentName: 'div', data: ['1'] },
          items: {
            type: 'string',
            'x-decorator-props': { k1: '1', k2: '2' },
            'x-component': 'span',
            'x-component-props': { children: 'span' },
          },
        },
      },
    }} />);
    expect(screen.getByRole('children')).toHaveTextContent('span');
    expect(screen.getByRole('rest')).toHaveTextContent('{"k1":"1","k2":"2"}');
  });

  test('decorator no some', () => {
    render(<Render schema={{
      type: 'object',
      properties: {
        A: {
          'x-component': 'A',
          'x-component-props': { componentName: 'div', data: ['1'] },
          items: {
            type: 'string',
            'x-decorator': 'span',
            'x-component': 'span',
            'x-component-props': { children: 'span' },
          },
        },
      },
    }} />);
    expect(screen.getByRole('children')).toHaveTextContent('span');
    expect(screen.getByRole('rest')).toHaveTextContent('{}');
  });

  test('not component', () => {
    render(<Render schema={{
      type: 'object',
      properties: {
        A: {
          'x-component': 'A',
          'x-component-props': { componentName: 'div', data: ['1'] },
          items: {
            type: 'string',
            'x-decorator': 'span',
            'x-decorator-props': { k1: '1', k2: '2', children: 'span' },
          },
        },
      },
    }} />);
    expect(document.body.textContent).toBe('{}');
  });
});
