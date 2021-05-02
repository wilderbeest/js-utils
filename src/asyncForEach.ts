import sequence from './sequence';

class AsyncForError extends Error {
  index: any;

  constructor(index, err) {
    super();
    this.name = 'AsyncForError';
    this.index = index;
    this.stack = err.stack;
  }
}

const asyncForEach = (arr, callback) => {
  return sequence(arr.map((currentValue, idx, readonlyArr) => async () => {
    try {
      await callback(currentValue, idx, readonlyArr);
    } catch (err) {
      throw new AsyncForError(idx, err);
    }
  }));
};

export default asyncForEach;
