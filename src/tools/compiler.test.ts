import { compiler } from './compiler';

describe('compiler', () => {
  test('should return undefined for empty expression', () => {
    expect(compiler('')).toBeUndefined();
  });

  test('should return value for simple expression', () => {
    expect(compiler('1 + 2')).toBe(3);
  });

  test('should return value for expression with variables', () => {
    expect(compiler('a + b', { a: 1, b: 2 })).toBe(3);
  });

  test('should handle parentheses', () => {
    expect(compiler('(1 + 2) * 3')).toBe(9);
  });

  test('should handle nested parentheses', () => {
    expect(compiler('(1 + (2 * 3)) / 2')).toBe(3.5);
  });

  test('should handle ternary operator', () => {
    expect(compiler('a > b ? a : b', { a: 2, b: 1 })).toBe(2);
  });

  test('should handle logical operators', () => {
    expect(compiler('a && b', { a: true, b: false })).toBe(false);
  });

  test('should handle comparison operators', () => {
    expect(compiler('a > b', { a: 2, b: 1 })).toBe(true);
  });

  test('should handle unary operators', () => {
    expect(compiler('!a', { a: false })).toBe(true);
  });

  test('should handle increment operator', () => {
    expect(compiler('a++', { a: 1 })).toBe(1);
    expect(compiler('++a', { a: 1 })).toBe(2);
  });

  test('should handle decrement operator', () => {
    expect(compiler('a--', { a: 1 })).toBe(1);
    expect(compiler('--a', { a: 1 })).toBe(0);
  });

  test('should handle complex expression', () => {
    expect(compiler('(a + b) * (c - d) / e ? f : g', { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 })).toBe(6);
  });
});
