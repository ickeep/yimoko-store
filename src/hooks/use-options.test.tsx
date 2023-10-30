import { renderHook } from '@testing-library/react';

import { useOptions } from './use-options';

describe('useOptions', () => {
  test('useOptions', () => {
    const data = [{ a: 'a' }, { a: 'a2' }];
    const keys: Record<string, string> = { value: 'a', label: 'a' };
    const { result, rerender } = renderHook(([data, keys, splitter]: any) => useOptions(data ?? [], keys, splitter), { initialProps: [data, keys] });
    expect(result.current[0]).toEqual([{ value: 'a', label: 'a' }, { value: 'a2', label: 'a2' }]);
    rerender([data, { name: 'a', id: 'a' }]);
    expect(result.current[0]).toEqual([{ id: 'a', name: 'a' }, { id: 'a2', name: 'a2' }]);
  });

  test('useOptions c', () => {
    const data = [{ a: 'a' }, { a: 'a2', child: [{ a: 'a3' }] }];
    const keys: Record<string, string> = { value: 'a', label: 'a' };
    const { result, rerender } = renderHook(([data, keys, splitter]: any) => useOptions(data ?? [], keys, splitter, 'child'), { initialProps: [data, keys] });
    expect(result.current[0]).toEqual([{ value: 'a', label: 'a' }, { value: 'a2', label: 'a2', child: [{ value: 'a3', label: 'a3' }] }]);
    rerender([data, { name: 'a', id: 'a' }]);
    expect(result.current[0]).toEqual([{ id: 'a', name: 'a' }, { id: 'a2', name: 'a2', child: [{ id: 'a3', name: 'a3' }] }]);
  });
});
