import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import { BaseStore } from '../store/base';

import { ArrayBase, ArrayRender } from './array-base';
import { StorePage } from './page/store';

describe('ArrayBase', () => {
  test('render', () => {
    render(<ArrayBase />);
    expect(document.body.textContent).toBe('');
  });

  test('schema render', () => {
    const store = new BaseStore({ defaultValues: { array: [{ name: '张三' }, { name: '李四' }] } });
    render(<StorePage
      components={{ ArrayRender }}
      store={store}
      schema={{
        type: 'object',
        properties: {
          array: {
            type: 'array',
            'x-component': 'ArrayRender',
            items: [{
              name: 'name',

            }],
          },
        },
      }}
    ></StorePage>);

    expect(document.body.textContent).toBe('');
  });

  // it('renders children', () => {
  //   const { getByText } = render(<ArrayBase>
  //     <div>Child 1</div>
  //     <div>Child 2</div>
  //   </ArrayBase>);
  //   expect(getByText('Child 1')).toBeInTheDocument();
  //   expect(getByText('Child 2')).toBeInTheDocument();
  // });

  // it('calls onPush when button is clicked', async () => {
  //   const onPush = jest.fn();
  //   const { getByText } = render(<ArrayBase onPush={onPush} />);
  //   fireEvent.click(getByText('Push'));
  //   expect(onPush).toHaveBeenCalled();
  // });

  // Add more tests as needed
});
