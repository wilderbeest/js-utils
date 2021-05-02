import asyncForEach from './asyncForEach';

describe('asyncFor.js', () => {
  it('executes the items in order', async () => {
    const elems = ['a', 'b', 'c'];
    const cb = jest.fn();

    await asyncForEach(elems, cb);

    expect(cb.mock.calls).toEqual([
      ['a', 0, elems],
      ['b', 1, elems],
      ['c', 2, elems],
    ]);
  });

  it('waits for each item to finish before executing the next', async () => {
    const elems = ['a', 'b', 'c'];
    const calledArgs : string[] = [];

    await asyncForEach(elems, (elem) => new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          if (elem === 'a') {
            expect(calledArgs.length).toBe(0);
          } else if (elem === 'b') {
            expect(calledArgs.length).toBe(1);
            expect(calledArgs[0]).toBe('a');
          } else if (elem === 'c') {
            expect(calledArgs.length).toBe(2);
            expect(calledArgs[0]).toBe('a');
            expect(calledArgs[1]).toBe('b');
          }

          calledArgs.push(elem);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 100);
    }));
  });

  it('indicates the item index in the error', async () => {
    const elems = ['a', 'b', 'c'];
    try {
      await asyncForEach(elems, async (elem) => {
        if (elem === 'b') {
          throw new Error('OOPS!');
        }
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('index', 1);
    }
  });
});
