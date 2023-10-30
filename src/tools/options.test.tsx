import { arrToOptions, strToOptions, objToOptions, dataToOptions, judgeValueInOptions, optionsToMap } from './options';

describe('arrToOptions', () => {
  test('null', () => {
    expect(arrToOptions()).toEqual([]);
  });

  test('no keys', () => {
    const options = [{ label: '1', value: '1' }, { label: '2', value: '2' }];
    expect(arrToOptions(options)).toEqual(options);
  });

  test('no options', () => {
    const keys = { label: 'label', value: 'value' };
    expect(arrToOptions(undefined, keys)).toEqual([]);
  });

  test('keys', () => {
    const options = [{ label1: '1', value1: '1', x: 'x1' }, { label1: '2', value1: '2', x: 'x2' }];
    const keys = { label: 'label1', value: 'value1' };
    expect(arrToOptions<'label1' | 'value1' | 'x'>(options, keys)).toEqual([
      { label: '1', value: '1', x: 'x1' },
      { label: '2', value: '2', x: 'x2' },
    ]);
  });

  test('value undefined', () => {
    const options = [{ b: '1' }, { a: '2' }, { c: 'c' }];
    // @ts-ignore
    expect(arrToOptions(options, { a: 'b' })).toEqual([{ a: '1' }, { a: undefined }, { c: 'c' }]);
  });

  test('childrenKey', () => {
    const options = [
      { id: '1', name: '1', children: [{ id: '11', name: '11' }] },
      { id: '2', name: '2' },
      { id: '3', name: '3', children: null },
      { id: 4, name: '4', children: { 1: { id: 1, name: '1' } } },
    ];
    const keys = { label: 'name', value: 'id' };
    expect(arrToOptions(options, keys, 'children')).toEqual([
      { label: '1', value: '1', children: [{ label: '11', value: '11' }] },
      { label: '2', value: '2' },
      { label: '3', value: '3', children: [] },
      { label: '4', value: 4, children: [{ label: '1', value: 1 }] },
    ]);
  });
});

describe('strToOptions', () => {
  test('null', () => {
    expect(strToOptions()).toEqual([]);
  });

  test('no keys', () => {
    expect(strToOptions('1,2')).toEqual([{ label: '1', value: '1' }, { label: '2', value: '2' }]);
  });

  test('no options', () => {
    const keys = { label: 'label', value: 'value' };
    expect(strToOptions(undefined, ',', keys)).toEqual([]);
  });

  test('keys', () => {
    const keys = { label: 'label1', value: 'value1' };
    expect(strToOptions('1.2', '.', keys)).toEqual([
      { label: '1', value: '1' },
      { label: '2', value: '2' },
    ]);
  });
});

describe('objToOptions', () => {
  test('null', () => {
    expect(objToOptions()).toEqual([]);
  });
  test('no keys', () => {
    expect(objToOptions({ 1: '1', 2: null })).toEqual([{ label: '1', value: '1' }, { label: '2', value: '2' }]);
  });
  test('no options', () => {
    const keys = { label: 'label', value: 'value' };
    expect(objToOptions(undefined, keys)).toEqual([]);
  });

  test('keys', () => {
    const keys = { label: 'label1' };
    expect(objToOptions({ 1: { label1: '1' }, 2: { label1: '2' } }, keys)).toEqual([
      { label: '1', value: '1' },
      { label: '2', value: '2' },
    ]);
  });

  test('keys value', () => {
    const keys = { label: 'label1', value: 'value1' };
    expect(objToOptions({ 1: { label1: '1', value1: 'v1' }, 2: { label1: '2', value1: 'v2' } }, keys)).toEqual([
      { label: '1', value: 'v1' },
      { label: '2', value: 'v2' },
    ]);
  });

  test('childrenKey', () => {
    const keys = { label: 'name', value: 'id', children: 'child' };
    expect(objToOptions({
      1: { id: '1', name: '1', child: { 11: { id: '11', name: '11' } } },
      2: { id: '2', name: '2', child: '' },
      3: { id: '3', name: '3', child: [{ id: '1', name: '1' }] },
    }, keys, 'children')).toEqual([
      { label: '1', value: '1', children: [{ label: '11', value: '11' }] },
      { label: '2', value: '2', children: [] },
      { label: '3', value: '3', children: [{ label: '1', value: '1' }] },
    ]);
  });
});

describe('dataToOptions', () => {
  const keys = { label: 'label1', value: 'value1' };
  const data = [{ label: '1', value: '1' }, { label: '2', value: '2' }];

  test('odd', () => {
    expect(dataToOptions()).toEqual([]);
    expect(dataToOptions(true)).toEqual([]);
    expect(dataToOptions(false)).toEqual([]);
    expect(dataToOptions({})).toEqual([]);
    expect(dataToOptions(null)).toEqual([]);
    expect(dataToOptions(undefined)).toEqual([]);
    expect(dataToOptions(() => '')).toEqual([]);
  });

  test('arr', () => {
    expect(dataToOptions([{ label1: '1', value1: '1' }, { label1: '2', value1: '2' }], keys)).toEqual(data);
  });

  test('arr children', () => {
    const options = [
      { id: '1', name: '1', children: [{ id: '11', name: '11' }] },
      { id: '2', name: '2' },
      { id: '3', name: '3', children: null },
      { id: 4, name: '4', children: { 1: { id: 1, name: '1' } } },
    ];
    const keys = { label: 'name', value: 'id' };
    expect(dataToOptions(options, keys, ',', 'children')).toEqual([
      { label: '1', value: '1', children: [{ label: '11', value: '11' }] },
      { label: '2', value: '2' },
      { label: '3', value: '3', children: [] },
      { label: '4', value: 4, children: [{ label: '1', value: 1 }] },
    ]);
  });

  test('str', () => {
    expect(dataToOptions('1,2', keys)).toEqual(data);
    expect(dataToOptions('1|2', keys, '|')).toEqual(data);
  });

  test('obj', () => {
    expect(dataToOptions({ 1: '1', 2: '2' })).toEqual(data);
    expect(dataToOptions({ 1: { label1: '1', value1: '1' }, 2: { label1: '2', value1: '2' } }, keys)).toEqual(data);
  });

  test('obj childrenKey', () => {
    const keys = { label: 'name', value: 'id', children: 'child' };
    expect(dataToOptions({
      1: { id: '1', name: '1', child: { 11: { id: '11', name: '11' } } },
      2: { id: '2', name: '2', child: '' },
      3: { id: '3', name: '3', child: [{ id: '1', name: '1' }] },
    }, keys, ',', 'children')).toEqual([
      { label: '1', value: '1', children: [{ label: '11', value: '11' }] },
      { label: '2', value: '2', children: [] },
      { label: '3', value: '3', children: [{ label: '1', value: '1' }] },
    ]);
  });
});

describe('judgeValueInOptions', () => {
  test('judgeValueInOptions', () => {
    expect(judgeValueInOptions(1, [{ label: '1', value: '1' }, { label: '2', value: '2' }])).toBeFalsy();
    expect(judgeValueInOptions('1', [{ label: '1', value: '1' }, { label: '2', value: '2' }])).toBeTruthy();
    expect(judgeValueInOptions(['1', '2'], [{ label: '1', value: '1' }, { label: '2', value: '2' }])).toBeTruthy();
    expect(judgeValueInOptions(['1', '3'], [{ label: '1', value: '1' }, { label: '2', value: '2' }])).toBeFalsy();
    expect(judgeValueInOptions('1', [])).toBeFalsy();
    // @ts-ignore
    expect(judgeValueInOptions('1', undefined)).toBeFalsy();
    // @ts-ignore
    expect(judgeValueInOptions('1', null)).toBeFalsy();

    expect(judgeValueInOptions('1', [{ label: '1', id: '1' }, { label: '2', id: '2' }], { value: 'id' })).toBeTruthy();

    // childrenKey
    expect(judgeValueInOptions('11', [{ label: '1', id: '1', children: [{ label: '11', id: '11' }] }, { label: '2', id: '2' }], { value: 'id' }, 'children')).toBeTruthy();
  });
});

describe('optionsToMap', () => {
  test('empty options', () => {
    const options: any[] = [];
    const map = optionsToMap(options);
    expect(map).toEqual({});
  });

  test('non-array options', () => {
    const options = { a: 1, b: 2 };
    // @ts-ignore
    const map = optionsToMap(options);
    expect(map).toEqual(options);
  });

  test('default keys', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];
    const map = optionsToMap(options);
    expect(map).toEqual({
      1: 'Option 1',
      2: 'Option 2',
      3: 'Option 3',
    });
  });

  test('custom keys', () => {
    const options: any[] = [
      { id: '1', name: 'Option 1' },
      { id: '2', name: 'Option 2' },
      { id: '3', name: 'Option 3' },
    ];
    const map = optionsToMap(options, { value: 'id', label: 'name' });
    expect(map).toEqual({
      1: 'Option 1',
      2: 'Option 2',
      3: 'Option 3',
    });
  });
});
