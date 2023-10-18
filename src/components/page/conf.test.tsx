import { renderHook } from '@testing-library/react';

import { BaseStore } from '../../store/base';
import { OperateStore } from '../../store/operate';


import { OperatePageProps, PageStoreConfig, getAddPath, getDetailPath, getEditPath, getListPath, jumpOnOperateSuccess, useOperateRunAfter } from './conf';

describe('getListPath', () => {
  test('returns basePath + list if path.list is defined', () => {
    const config: PageStoreConfig = { basePath: '/api', path: { list: '/users' }, fieldsConfig: {}, api: {} };
    expect(getListPath(config)).toBe('/api/users');
  });

  test('returns basePath if path.list is undefined', () => {
    const config = { basePath: '/api', path: {}, fieldsConfig: {}, api: {} };
    expect(getListPath(config)).toBe('/api');
  });

  test('returns basePath if path is undefined', () => {
    const config = { basePath: '/api', fieldsConfig: {}, api: {} };
    expect(getListPath(config)).toBe('/api');
  });
});
describe('getAddPath', () => {
  test('returns basePath + add if path.add is defined', () => {
    const config: PageStoreConfig = { basePath: '/api', path: { add: '/users/add' }, fieldsConfig: {}, api: {} };
    expect(getAddPath(config)).toBe('/api/users/add');
  });

  test('returns basePath + /add if path.add is undefined', () => {
    const config = { basePath: '/api', path: {}, fieldsConfig: {}, api: {} };
    expect(getAddPath(config)).toBe('/api/add');
  });

  test('returns basePath + /add if path is undefined', () => {
    const config = { basePath: '/api', fieldsConfig: {}, api: {} };
    expect(getAddPath(config)).toBe('/api/add');
  });

  test('returns basePath  if path is undefined', () => {
    const config = { fieldsConfig: {}, api: {} };
    expect(getAddPath(config)).toBe('/add');
  });
});
describe('getEditPath', () => {
  const record = { id: 123, name: 'John Doe' };
  const config = { basePath: '/api', path: { edit: '/users/edit' }, idKey: 'id', fieldsConfig: {}, api: {} };

  test('returns the correct edit path', () => {
    expect(getEditPath(record, config)).toBe('/api/users/edit?id=123');
  });

  test('returns the correct edit path with custom id key', () => {
    const customConfig = { ...config, idKey: 'customId' };
    expect(getEditPath({ ...record, customId: 456 }, customConfig)).toBe('/api/users/edit?customId=456');
  });

  test('returns the correct edit path with empty path', () => {
    const emptyPathConfig = { basePath: '/api', idKey: 'id', fieldsConfig: {}, api: {} };
    expect(getEditPath(record, emptyPathConfig)).toBe('/api/edit?id=123');
  });

  test('returns the correct edit path with empty base path', () => {
    const emptyBasePathConfig = { path: { edit: '/users/edit' }, fieldsConfig: {}, api: {} };
    expect(getEditPath(record, emptyBasePathConfig)).toBe('/users/edit?id=123');
  });
});

describe('getDetailPath', () => {
  const record = { id: 123, name: 'John Doe' };
  const config = { basePath: '/api', path: { detail: '/users/detail' }, idKey: 'id', fieldsConfig: {}, api: {} };

  test('returns the correct detail path', () => {
    expect(getDetailPath(record, config)).toBe('/api/users/detail?id=123');
  });

  test('returns the correct detail path with custom id key', () => {
    const customConfig = { ...config, idKey: 'customId' };
    expect(getDetailPath({ ...record, customId: 456 }, customConfig)).toBe('/api/users/detail?customId=456');
  });

  test('returns the correct detail path with empty path', () => {
    const emptyPathConfig = { basePath: '/api', idKey: 'id', fieldsConfig: {}, api: {} };
    expect(getDetailPath(record, emptyPathConfig)).toBe('/api/detail?id=123');
  });

  test('returns the correct detail path with empty base path', () => {
    const emptyBasePathConfig = { path: { detail: '/users/detail' }, fieldsConfig: {}, api: {} };
    expect(getDetailPath(record, emptyBasePathConfig)).toBe('/users/detail?id=123');
  });
});
describe('jumpOnOperateSuccess', () => {
  const mockNav = jest.fn();
  const storeConfig = { basePath: '/api', path: { list: '/users' }, fieldsConfig: {}, api: {} };
  const pageProps = { isBoxContent: false, jumpOnSuccess: true, storeConfig };

  beforeEach(() => {
    mockNav.mockClear();
  });

  test('navigates to list path when jumpOnSuccess is true and listPath is defined', () => {
    jumpOnOperateSuccess(pageProps, mockNav);
    expect(mockNav).toHaveBeenCalledWith('/api/users', { replace: true });
  });

  test('navigates to custom path when jumpOnSuccess is a string and not empty', () => {
    const customPath = '/custom/path';
    const customPageProps = { ...pageProps, jumpOnSuccess: customPath };
    jumpOnOperateSuccess(customPageProps, mockNav);
    expect(mockNav).toHaveBeenCalledWith(customPath, { replace: true });
  });

  test('does not navigate when jumpOnSuccess is false', () => {
    const noJumpPageProps = { ...pageProps, jumpOnSuccess: false };
    jumpOnOperateSuccess(noJumpPageProps, mockNav);
    expect(mockNav).not.toHaveBeenCalled();
  });

  test('does not navigate when jumpOnSuccess is a string but empty', () => {
    const emptyJumpPageProps = { ...pageProps, jumpOnSuccess: '' };
    jumpOnOperateSuccess(emptyJumpPageProps, mockNav);
    expect(mockNav).not.toHaveBeenCalled();
  });
});


describe('useOperateRunAfter', () => {
  const mockNavigate = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnFail = jest.fn();
  const mockParentAPI = jest.fn();
  // mock useRouter 的返回值

  const mockParentStore = new BaseStore({ api: mockParentAPI });
  const mockStore = new OperateStore({ runAfter: {} });
  const pageProps: OperatePageProps = {
    isBoxContent: false,
    onSuccess: mockOnSuccess,
    onFail: mockOnFail,
    parentStore: mockParentStore,
    isRefreshParent: true,
    storeConfig: {
      fieldsConfig: {},
      api: {},
    },
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnSuccess.mockClear();
    mockOnFail.mockClear();
    mockParentAPI.mockClear();
  });

  test('returns runAfter object', () => {
    //  使用 renderHook
    const { result } = renderHook(() => useOperateRunAfter(pageProps));
    expect(result).toEqual(expect.any(Object));
  });

  test('calls on runOnSuccess', () => {
    const { result } = renderHook(() => useOperateRunAfter(pageProps));
    expect(result?.current?.runOnSuccess).toEqual(expect.any(Function));
    result?.current?.runOnSuccess?.({ code: 0, msg: 'success' }, mockStore);
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockParentAPI).toHaveBeenCalled();
  });

  test('calls on runOnFail', () => {
    const { result } = renderHook(() => useOperateRunAfter(pageProps));
    expect(result?.current?.runOnFail).toEqual(expect.any(Function));
    result?.current?.runOnFail?.({ code: 1, msg: 'fail' }, mockStore);
    expect(mockOnFail).toHaveBeenCalled();
  });

  test('runAfter not empty', () => {
    const curOnSuccess = jest.fn();
    const curOnFail = jest.fn();
    const curStore = new OperateStore({ runAfter: { runOnSuccess: curOnSuccess, runOnFail: curOnFail } });

    const { result } = renderHook(() => useOperateRunAfter({ ...pageProps, isRefreshParent: undefined, store: curStore }));
    result?.current?.runOnSuccess?.({ code: 0, msg: 'success' }, mockStore);
    expect(curOnSuccess).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();

    result?.current?.runOnFail?.({ code: 1, msg: 'fail' }, mockStore);
    expect(curOnFail).toHaveBeenCalled();
    expect(mockOnFail).not.toHaveBeenCalled();
  });
});
