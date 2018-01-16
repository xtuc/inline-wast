# inline-wast

> Inline WebAssembly in your JavaScript

## Motivations

The idea is (almost) the same than the built-in `asm` (or `__asm__`) function in C.
Express your computation using the WebAssembly backend or an [interpreter](https://github.com/xtuc/js-webassembly-interpreter).

WAST is a superset of WATF (`.wat`) and is not part of the WebAssembly specification but we use it for convenience.

## Example

### Instructions

```js
const {wastInstructions} = require('inline-wast/lib/interpreter');

function add(a, b) {
  const fn = wastInstructions`
    (i32.const ${a})
    (i32.const ${b})
    (i32.add)
  `;

  return fn();
}

console.log(add(1, 1)); // 2
```

### Function declaration

```js
const {wast} = require('inline-wast/lib/interpreter');

function add(a, b) {
  const exports = wast(`
    (func (export "add") (param $l i32) (param $r i32) (result i32)
      (get_local $l)
      (get_local $r)
      (i32.add)
    )
  `);

  return exports.add(a, b);
}

console.log(add(1, 1)); // 2
```

### Native

If you want to use the native WebAssembly backend the usage remains the same, but you need to use:

```js
const {wastInstructions, wast} = require('inline-wast/lib/native');
```

It's not recommended for now, the WAST to WASM conversion needs to be refactored.
