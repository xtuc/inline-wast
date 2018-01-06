// @flow

const {instantiateFromSource} = require('webassembly-interpreter');

function wast(string) {
  const program = (`
    (module ${string})
  `);

  const instance = instantiateFromSource(program);
  return instance.exports;
}

function wastInstructions(strings, ...params) {
  if (typeof strings === 'string') {
    throw new TypeError("wastInstructions: please use the tagged template");
  }

  const code = strings.reduce((acc, string) => {
    let param = '';

    if (params.length !== 0) {
      param = params.pop();

      if (typeof param !== 'number') {
        throw new TypeError('Unexpected variable of type: ' + (typeof param));
      }
    }

    acc += string + param;

    return acc;
  }, '');

  const res = wast(`
    (func (export "main") (result i32) ${code})
  `);

  return function() {
    return res.main(...params);
  }
}

module.exports = {
  wast,
  wastInstructions,
}
