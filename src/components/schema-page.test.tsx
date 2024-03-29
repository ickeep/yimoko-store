import { createForm } from '@formily/core';
import { render, screen } from '@testing-library/react';

import React from 'react';

import { BaseStore } from '../store/base';
import { JSONStringify } from '../tools/tool';

import { SchemaPage } from './schema-page';

describe('SchemaPage', () => {
  const components = {
    A: ({ value }: any) => <p>{value}</p>,

  };

  test('empty', () => {
    const model = createForm({ values: { a: 'a' } });
    render(<SchemaPage components={components} model={model} />);
    expect(document.body.textContent).toBe('');
  });

  test('model', () => {
    const model = createForm({ values: { a: 'a' } });
    render(<SchemaPage components={components} model={model} schema={{ type: 'object', properties: { a: { 'x-component': 'A' } } }} />);
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  test('options', () => {
    render(<SchemaPage
      components={components}
      options={{ values: { a: 'a' } }}
      schema={{ type: 'object', properties: { a: { 'x-component': 'A' } } }}
    />);
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  test('curStore', () => {
    const curStore = new BaseStore({ api: {}, defaultValues: { a: 'a' }, fieldsConfig: { a: { 'x-component': 'A' } } });
    render(<SchemaPage
      components={components}
      scope={{ curStore }}
      schema={{ type: 'object', properties: { a: { $ref: '#/definitions/a' } } }}
    />);
    expect(screen.getByText('a')).toBeInTheDocument();
  });

  test('definitions str', () => {
    const curStore = new BaseStore({ api: {}, defaultValues: { a: 'a' }, fieldsConfig: { a: { 'x-component': 'A' } } });
    render(<SchemaPage
      components={components}
      scope={{ curStore }}
      schema={{ type: 'object', definitions: 'xxx', properties: { a: { $ref: '#/definitions/a' } } }}
    />);
    expect(screen.getByText('a')).toBeInTheDocument();
  });


  test('definitions assign', () => {
    const curStore = new BaseStore({ api: {}, defaultValues: { a: 'a', b: 'b' }, fieldsConfig: { a: { 'x-component': 'A' } } });
    render(<SchemaPage
      components={components}
      scope={{ curStore }}
      schema={{
        type: 'object', definitions: { b: { 'x-component': 'A' } },
        properties: { a: { $ref: '#/definitions/a' }, b: { $ref: '#/definitions/b' } },
      }}
    />);
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });

  test('tooltip', () => {
    const FormItem = jest.fn(({ tooltip }) => <p>{typeof tooltip === 'object' ? JSONStringify(tooltip) : tooltip}</p>);
    const curStore = new BaseStore({
      defaultValues: { a: 'a', b: 'b' },
      api: {}, fieldsConfig: {
        a: { 'x-component': 'A', tooltip: '提示', 'x-decorator': 'FormItem' },
        b: { 'x-component': 'A', tooltip: { color: 'red', title: '提示' }, 'x-decorator': 'FormItem' },
      },
    });
    render(<SchemaPage
      components={{ ...components, FormItem }}
      scope={{ curStore }}
      schema={{
        type: 'object',
        properties: { a: { $ref: '#/definitions/a' }, b: { $ref: '#/definitions/b' } },
      }}
    />);
    expect(screen.getByText('提示')).toBeInTheDocument();
    expect(screen.getByText(JSONStringify({ color: 'red', title: '提示' }))).toBeInTheDocument();
  });
});
