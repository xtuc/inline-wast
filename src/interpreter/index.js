// @flow

const {instantiateFromSource} = require('webassembly-interpreter');

const moduleInstanceCache = {};

function wast(string) {

  if (typeof moduleInstanceCache[string] === 'undefined') {

    const program = (`
      (module ${string})
    `);

    moduleInstanceCache[string] = instantiateFromSource(program);
  }

  return moduleInstanceCache[string].exports;
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
