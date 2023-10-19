import { render } from '@testing-library/react';

import { OperateStore } from '../../store/operate';

import { AddPage } from './add';

describe('add page', () => {
  test('empty', () => {
    render(<AddPage />);
    expect(document.body.textContent).toBe('');
  });

  test('store', () => {
    const store = new OperateStore();
    render(<AddPage store={store} storeConfig={{ fieldsConfig: { name: {} }, api: { add: { url: 'add' } } }} />);
    expect(store.fieldsConfig).toEqual({ name: {} });
    expect(store.api).toEqual({ url: 'add' });
  });
});
