import { render } from '@testing-library/react';

import React from 'react';

import { BaseStore } from '../../store/base';
import { ConfigStore, ConfigStoreProvider } from '../../store/config';

import { StorePageContent } from './store-content';

describe('store-content', () => {
  test('empty', () => {
    render(<StorePageContent />);
    expect(document.body.textContent).toBe('');
  });

  test('skeleton', () => {
    const store = new BaseStore();
    store.setLoading(true);
    render(<StorePageContent store={store} skeleton={{}} />);
    expect(document.body.textContent).toBe('loading');
  });

  test('loading', () => {
    const store = new BaseStore();
    store.setLoading(true);
    store.setResponse({ code: 0, message: 'ok' });
    render(<StorePageContent store={store} >Content</StorePageContent>);
    expect(document.body.textContent).toBe('Content');
  });

  test('ErrorContent', () => {
    const store = new BaseStore();
    store.setResponse({ code: 1, message: 'err' });
    render(<StorePageContent store={store} />);
    expect(document.body.textContent).toBe('error');
  });

  test('自定义组件 ErrorContent', () => {
    const store = new BaseStore({});
    const ErrorContent = jest.fn(() => <>ErrorContent</>);
    const Loading = jest.fn(() => <>Loading</>);
    store.setResponse({ code: 1, message: 'err' });
    render(<ConfigStoreProvider value={new ConfigStore({}, {
      apiExecutor: jest.fn(),
      notifier: jest.fn(),
      useRouter: jest.fn(),
      components: { ErrorContent, Loading },
    })}>
      <StorePageContent store={store} isAgain={false} load={true} />
    </ConfigStoreProvider>);
    expect(document.body.textContent).toBe('ErrorContent');

    // 调用的参数 onAgain 为 undefined
    expect(ErrorContent).toHaveBeenCalledWith({ response: { code: 1, message: 'err' }, isReturnIndex: undefined, onAgain: undefined, loading: false }, {});
  });

  test('自定义组件 Loading', () => {
    const store = new BaseStore({});
    const ErrorContent = jest.fn(() => <>ErrorContent</>);
    const Loading = jest.fn(() => <>Loading</>);
    store.setResponse({ code: 0, message: 'ok' });
    store.setLoading(true);
    render(<ConfigStoreProvider value={new ConfigStore({}, {
      apiExecutor: jest.fn(),
      notifier: jest.fn(),
      useRouter: jest.fn(),
      components: { ErrorContent, Loading },
    })}>
      <StorePageContent store={store} load={{ x: 'x' }} />
    </ConfigStoreProvider>);

    expect(Loading).toHaveBeenCalledWith({ loading: true, x: 'x' }, {});
  });
});
