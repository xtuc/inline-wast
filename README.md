# inline-wast

> Inline WebAssembly in your JavaScript

## Motivations

The idea is (almost) the same than the built-in `asm` (or `__asm__`) function in C.
Express your computation using the WebAssembly backend or an [interpreter](https://github.com/xtuc/js-webassembly-interpreter).

WAST is a superset of WATF (`.wat`) and is not part of the WebAssembly specification but we use it for convenience.

## Example

### Instructions

```js
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
function add(a, b) {
  const exports = wast(`
    (func (export "add") (param i32) (param i32) (result i32)
      (get_local 0)
      (get_local 1)
      (i32.add)
    )
  `);

  return exports.add(a, b);
}

console.log(add(1, 1)); // 2
```
