import { compiler } from './compiler';

describe('compiler', () => {
  test('should return undefined for empty expression', () => {
    expect(compiler('')).toBeUndefined();
    expect(compiler('a', { a: 1, b: 2 })).toBe(1);
  });

  // 变量包含了 $
  test('should return undefined for expression with $', () => {
    expect(compiler('$a')).toBeUndefined();
    // 有值
    expect(compiler('$a', { $a: 1 })).toBe(1);
  });

  test('should return value for simple expression', () => {
    expect(compiler('1 + 2')).toBe(3);
    expect(compiler('1 + 2 - 3')).toBe(0);
  });

  test('should return value for string expression', () => {
    expect(compiler('"a" + "b"')).toBe('ab');
    expect(compiler('"a" + "b" + 1 + 2')).toBe('ab12');
    expect(compiler('\'a\' + \'b\'')).toBe('ab');
  });

  // boolean
  test('should return value for boolean expression', () => {
    expect(compiler('true')).toBe(true);
    expect(compiler('false')).toBe(false);
    expect(compiler('true && false')).toBe(false);
    expect(compiler('true || false')).toBe(true);
  });

  test('should return value for expression with variables', () => {
    expect(compiler('a + b', { a: 1, b: 2 })).toBe(3);
  });

  test('should handle parentheses', () => {
    expect(compiler('(1 + 2) * 3')).toBe(9);
    expect(compiler('(1 + 2) % 3')).toBe(0);
  });

  test('should handle nested parentheses', () => {
    expect(compiler('(1 + (2 * 3)) / 2')).toBe(3.5);
  });

  test('should handle ternary operator', () => {
    expect(compiler('a > b ? a : b', { a: 2, b: 1 })).toBe(2);
  });

  test('should handle logical operators', () => {
    expect(compiler('a && b', { a: true, b: false })).toBe(false);
    expect(compiler('a && b && c', { a: true, b: true, c: false })).toBe(false);
  });

  test('should handle comparison operators', () => {
    expect(compiler('a > b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a < b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a >= b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a <= b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a == b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a === b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a != b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a !== b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a > b > c', { a: 3, b: 2, c: 1 })).toBe(false);
  });

  test('should handle unary operators', () => {
    expect(compiler('!a', { a: false })).toBe(true);
  });


  test('should handle complex expression', () => {
    expect(compiler('(a + b) * (c - d) / e ? f : g', { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 })).toBe(6);
  });

  test('should handle complex expression with logical operators', () => {
    expect(compiler('a && b ? c : d', { a: true, b: false, c: 1, d: 2 })).toBe(2);
    expect(compiler('a || b ? c : d', { a: true, b: false, c: 1, d: 2 })).toBe(1);
  });

  test('should handle complex expression with comparison operators', () => {
    expect(compiler('a > b ? c : d', { a: 2, b: 1, c: 1, d: 2 })).toBe(1);
  });

  test('should handle complex expression with unary operators', () => {
    expect(compiler('!a ? b : c', { a: false, b: 1, c: 2 })).toBe(1);
  });

  test('should handle complex expression with multiple ternary operators', () => {
    expect(compiler('a ? b : c ? d : e', { a: true, b: 1, c: false, d: 2, e: 3 })).toBe(1);
  });
});
