// @flow

const libwabt = require('./libwabt');

function run({buffer}) {
  const module = new WebAssembly.Module(buffer);
  const instance = new WebAssembly.Instance(module);
  return instance;
}

function wastToWasm(script) {
  const module = libwabt.parseWat('inline.wast', script);
  return module;
}

function wast(string) {
  const program = wastToWasm(`
    (module ${string})
  `);


  program.resolveNames();
  program.validate();

  const binaryOutput = program.toBinary({log: true, write_debug_names:true});

  const instance = run(binaryOutput);
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
