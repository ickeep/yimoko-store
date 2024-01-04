import { render, screen, act } from '@testing-library/react';

import React from 'react';

import { ConfigStore, ConfigStoreProvider } from '../store/config';

import { IKeys } from '../tools/options';
import { JSONStringify } from '../tools/tool';

import { IOptionsAPI, useAPIOptions } from './use-api-options';

describe('useAPIOptions', () => {
  const C = (props: { data?: any, api?: IOptionsAPI, keys?: IKeys, splitter?: string, childrenKey?: string, }) => {
    const [options, loading, setOptions] = useAPIOptions(props.data, props.api, props.keys, props.splitter, props.childrenKey);
    return <div>
      <p>{loading?.toString()}</p>
      <p>{JSONStringify(options)}</p>
      <button onClick={() => setOptions(props.data)}>setOptions</button>
    </div>;
  };

  test('data', () => {
    render(<C data={[{ label: 'l', value: 'v' }]} />);
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getByText('[{"label":"l","value":"v"}]')).toBeInTheDocument();
  });

  test('api', async () => {
    const useRouter = jest.fn();
    const apiExecutor = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: { a: 'a', b: 'b' } }));
    const configStore = new ConfigStore({}, { apiExecutor, useRouter, notifier: () => '' });

    render(<ConfigStoreProvider value={configStore}>
      <C data={[{ label: 'l', value: 'v' }]} api={{}} />
    </ConfigStoreProvider>);
    expect(screen.getByText('true')).toBeInTheDocument();
    expect(screen.getByText('[{"label":"l","value":"v"}]')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act((async () => { }));
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getByText('[{"value":"a","label":"a"},{"value":"b","label":"b"}]')).toBeInTheDocument();
    await act((async () => {
      screen.getByText('setOptions').click();
    }));
    expect(screen.getByText('[{"label":"l","value":"v"}]')).toBeInTheDocument();
  });

  test('keys', async () => {
    const apiExecutor = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: [{ id: 1, name: 'n1', child: [{ id: 2, name: 'n2' }] }] }));
    const useRouter = jest.fn();
    const configStore = new ConfigStore({}, { apiExecutor, useRouter, notifier: () => '' });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act((async () => {
      render(<ConfigStoreProvider value={configStore}>
        <C keys={{ label: 'name', value: 'id' }} api={{}} childrenKey="child" />
      </ConfigStoreProvider>);
    }));
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getByText('[{"child":[{"label":"n2","value":2}],"label":"n1","value":1}]')).toBeInTheDocument();
  });

  test('keys 2', async () => {
    const useRouter = jest.fn();
    const apiExecutor = jest.fn(() => Promise.resolve({ code: 0, msg: '', data: 'a|b' }));
    const configStore = new ConfigStore({}, { apiExecutor, useRouter, notifier: () => '' });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act((async () => {
      render(<ConfigStoreProvider value={configStore}>
        <C splitter='|' api={{}} />
      </ConfigStoreProvider>);
    }));
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getByText('[{"label":"a","value":"a"},{"label":"b","value":"b"}]')).toBeInTheDocument();
  });
});

