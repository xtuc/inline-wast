const now = require('performance-now');
const interpreter = require('../lib/interpreter');
const native = require('../lib/native');

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

function runBench(fn) {

  const t0 = now();

  for (let i = 0; i < NBINTERATION; i++) {
    const l = Math.random() * 10 | 0;
    const r = Math.random() * 10 | 0;

    fn(l, r);
  }

  const t1 = now();

  output('total ' + formatNumber(t1 - t0));
  output('mean ' + formatNumber((t1 - t0) / NBINTERATION));
}

runBench(function testNative(x, y) {
  return x + y;
});

runBench(function testWebAssembly(x, y) {
  const fn = native.wastInstructions`
    (i32.const ${x})
    (i32.const ${y})
    (i32.add)
  `;

  return fn(x, y);
});
