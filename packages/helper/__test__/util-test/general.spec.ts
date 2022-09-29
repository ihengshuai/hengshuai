import { describe, test, expect } from '@jest/globals';
import { compose, curry, runQueue } from '../../src/utils/general';

describe('general util test', () => {
  test('test compose method', () => {
    expect(
      compose(
        (x: number) => x * 2,
        (x: number) => x + 2,
      )(2),
    ).toBe(8);
  });
  test('test curry method', () => {
    expect(curry((x: number, y: number) => x * y, 2)(3)).toBe(6);
  });

  test('test curry runQueue', () => {
    expect(
      runQueue(
        [() => 2],
        () => 1,
        () => 1,
      ),
    );
  });
});
