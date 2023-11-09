import { observer } from '@formily/react';
import { render, screen } from '@testing-library/react';
import { ComponentType } from 'react';

import { useSchemaComponents } from './schema-components';

const NameConsumer = observer(({ c }: { c: string, cs?: any }) => {
  const components = useSchemaComponents();
  const C = components?.[c] as ComponentType;

  if (!C) {
    return <>unknown</>;
  }
  return <C />;
});

// const NameC = () => <p>name</p>;
// const TypeC = () => <p>type</p>;
// const DescC = () => <p>desc</p>;

describe('SchemaComponents', () => {
  test('SchemaComponentsContext', () => {
    render(<NameConsumer c='' />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });
});
