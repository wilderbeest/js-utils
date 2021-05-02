const sequence = require('./sequence');

class AsyncForError extends Error {
  constructor(index, err) {
    super();
    this.name = 'AsyncForError';
    this.index = index;
    this.stack = err.stack;
  }
}

const asyncForEach = (arr, callback) => {
  return sequence(arr.map((currentValue, idx, readonlyArr) => async (resolve, reject) => {
    try {
      await callback(currentValue, idx, readonlyArr);
    } catch (err) {
      throw new AsyncForError(idx, err);
    }
  }));
};

module.exports = asyncForEach;
