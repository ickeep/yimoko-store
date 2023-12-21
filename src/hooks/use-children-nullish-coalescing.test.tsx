import { render, renderHook, screen } from '@testing-library/react';

import React, { ReactNode } from 'react';

import { StorePage } from '../library';

import { useChildrenNullishCoalescing } from './use-children-nullish-coalescing';

describe('useChildrenNullishCoalescing', () => {
  const NullishCoalescing = (props: { children?: ReactNode }) => {
    const { children } = props;
    const result = useChildrenNullishCoalescing(children);
    return <div role='NullishCoalescing'>{result}</div>;
  };

  const NotNullishCoalescing = (props: { children?: ReactNode }) => {
    const { children } = props;
    return <div role='NotNullishCoalescing'>{children}</div>;
  };

  it('should return an empty object when useFieldSchema returns null or undefined', () => {
    const { result } = renderHook(() => useChildrenNullishCoalescing());
    expect(result.current).toBeUndefined();
  });

  it('render', () => {
    render(<NullishCoalescing />);
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing')).toBeEmptyDOMElement();

    render(<NotNullishCoalescing />);
    expect(screen.getByRole('NotNullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NotNullishCoalescing')).toBeEmptyDOMElement();
  });

  it('render children null', () => {
    render(<NullishCoalescing children={null} />);
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing')).toBeEmptyDOMElement();
  });

  it('render children undefined', () => {
    render(<NullishCoalescing children={undefined} />);
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing')).toBeEmptyDOMElement();
  });

  it('render children str', () => {
    render(<NullishCoalescing>Coalescing</NullishCoalescing>);
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing').textContent).toBe('Coalescing');
  });

  it('schema 显示传入 children 是 children的优先级最高', () => {
    render(<StorePage
      components={{ NullishCoalescing, NotNullishCoalescing }}
      store={{ defaultValues: { val: '1' } }}
      schema={{
        type: 'object',
        properties: {
          val: {
            type: 'string',
            'x-component': 'NullishCoalescing',
            'x-component-props': {
              children: 'children',
            },
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: 'Coalescing',
                },
              },
            },
          },
        },
      }}
    />);
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing').textContent).toBe('children');
  });

  it('schema str', () => {
    const renderC = (name: string) => <StorePage
      store={{ defaultValues: { str: 'str', num: 1, bool: true, arr: ['a1', 'a2'], obj: { a: 'a' } } }}
      components={{ NullishCoalescing, NotNullishCoalescing }}
      schema={{
        type: 'object',
        properties: {
          str: {
            type: 'string',
            'x-component': name,
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: 'Coalescing',
                },
              },
            },
          },
        },
      }}
    />;
    render(renderC('NullishCoalescing'));
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing').textContent).toBe('Coalescing');
    // 当渲染 value 为 type: 'string',时 默认不渲染 schema.properties
    render(renderC('NotNullishCoalescing'));
    expect(screen.getByRole('NotNullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NotNullishCoalescing')).toBeEmptyDOMElement();
  });

  it('schema num', () => {
    const renderC = (name: string) => <StorePage
      store={{ defaultValues: { str: 'str', num: 1, bool: true, arr: ['a1', 'a2'], obj: { a: 'a' } } }}
      components={{ NullishCoalescing, NotNullishCoalescing }}
      schema={{
        type: 'object',
        properties: {
          num: {
            type: 'number',
            'x-component': name,
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: 'Coalescing',
                },
              },
            },
          },
        },
      }}
    />;
    render(renderC('NullishCoalescing'));
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing').textContent).toBe('Coalescing');
    // 当渲染 value 为 type: 'number',时 默认不渲染 schema.properties
    render(renderC('NotNullishCoalescing'));
    expect(screen.getByRole('NotNullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NotNullishCoalescing')).toBeEmptyDOMElement();
  });

  it('schema bool', () => {
    const renderC = (name: string) => <StorePage
      store={{ defaultValues: { str: 'str', num: 1, bool: true, arr: ['a1', 'a2'], obj: { a: 'a' } } }}
      components={{ NullishCoalescing, NotNullishCoalescing }}
      schema={{
        type: 'object',
        properties: {
          bool: {
            type: 'boolean',
            'x-component': name,
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: 'Coalescing',
                },
              },
            },
          },
        },
      }}
    />;
    render(renderC('NullishCoalescing'));
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing').textContent).toBe('Coalescing');
    // 当渲染 value 为 type: 'boolean',时 默认不渲染 schema.properties
    render(renderC('NotNullishCoalescing'));
    expect(screen.getByRole('NotNullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NotNullishCoalescing')).toBeEmptyDOMElement();
  });

  it('schema arr', () => {
    const renderC = (name: string) => <StorePage
      store={{ defaultValues: { str: 'str', num: 1, bool: true, arr: ['a1', 'a2'], obj: { a: 'a' } } }}
      components={{ NullishCoalescing, NotNullishCoalescing }}
      schema={{
        type: 'object',
        properties: {
          arr: {
            type: 'array',
            'x-component': name,
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: 'Coalescing',
                },
              },
            },
          },
        },
      }}
    />;
    render(renderC('NullishCoalescing'));
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing').textContent).toBe('Coalescing');
    // 当渲染 value 为 type: 'array',时 默认不渲染 schema.properties
    render(renderC('NotNullishCoalescing'));
    expect(screen.getByRole('NotNullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NotNullishCoalescing')).toBeEmptyDOMElement();
  });

  it('schema obj', () => {
    const renderC = (name: string) => <StorePage
      store={{ defaultValues: { str: 'str', num: 1, bool: true, arr: ['a1', 'a2'], obj: { a: 'a' } } }}
      components={{ NullishCoalescing, NotNullishCoalescing }}
      schema={{
        type: 'object',
        properties: {
          obj: {
            type: 'object',
            'x-component': name,
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: 'Coalescing',
                },
              },
            },
          },
        },
      }}
    />;
    render(renderC('NullishCoalescing'));
    expect(screen.getByRole('NullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NullishCoalescing').textContent).toBe('Coalescing');
    // 当渲染 value 为 type: 'object',时 默认渲染 schema.properties
    render(renderC('NotNullishCoalescing'));
    expect(screen.getByRole('NotNullishCoalescing')).toBeInTheDocument();
    expect(screen.getByRole('NotNullishCoalescing').textContent).toBe('Coalescing');
  });
});
