const now = require('performance-now');
const interpreter = require('../lib/interpreter');
const nativeWebAssembly = require('../lib/native');

if (typeof WebAssembly === 'undefined') {
    console.log('WebAssembly not supported, skiping.');
    process.exit(0);
}

const NBINTERATION = Math.pow(10, 7);

function formatNumber(i) {
  let unit = 'ms';

  if (i < 1) {
    i *= Math.pow(10, 6);
    unit = 'ns';
  }

  return `${i.toFixed(10)} ${unit}`;
}

function output(str) {
  process.stdout.write(str + '\n');
}

function createRNG(nbr) {
  const numbers = [1, 2, 3, 4, 4, 5, 6, 7, 8, 9];
  const entropy = [];

  for (let i = 0; i < nbr; i++) {
    const v = numbers[Math.floor(Math.random() * numbers.length)];
    entropy.push(v);
  }

  return function get() {
    if (entropy.length === 0) {
      throw new Error("Entropy exhausted");
    }

    return entropy.pop();
  };
}

function runBench(fn) {
  const random = createRNG(NBINTERATION * 2)

  const t0 = now();

  for (let i = 0; i < NBINTERATION; i++) {
    const l = random();
    const r = random();

    fn(l, r);
  }

  const t1 = now();

  output(fn.name);

  output('total ' + formatNumber(t1 - t0));
  output('mean ' + formatNumber((t1 - t0) / NBINTERATION));
}

/**
 * Bench native JavaScript add
 */

runBench(function testNativeJS(l, r) {
  return l + r;
});

/**
 * Bench native WebAssembly
 */

const nativeWebAssemblyExports = nativeWebAssembly.wast(`
  (func (export "add") (param $l f64) (param $r f64) (result f64)
    (get_local $l)
    (get_local $r)
    (f64.add)
  )
`);

runBench(function testWebAssemblyFunc(x, y) {
  return nativeWebAssemblyExports.add(x, y);
});
