const {assert} = require('chai');
const {wast, wastInstructions} = require('../lib');

describe('wast instructions', () => {

  it('should throw if not used with a template', () => {
    const fn = () => wastInstructions('');

    assert.throws(fn);
  });

  it('should throw if variable has an incorrect type', () => {
    const fn1 = () => wastInstructions`${""}`;
    const fn2 = () => wastInstructions`${() => {}}`;

    assert.throws(fn1, TypeError);
    assert.throws(fn2, TypeError);
  });

  it('should pass variables', () => {
    const v = 1;

    const fn = wastInstructions`
      (i32.const ${v})
    `;

    assert.equal(fn(), 1);
  });

});

describe('wast', () => {

  it('shoud export functions', () => {
    const exports = wast(`
      (func (export "a"))
      (func (export "b"))
    `);

    assert.typeOf(exports.a, 'function');
    assert.typeOf(exports.b, 'function');
  });

  it('should pass arguments', () => {
    const v = 1;

    const exports = wast(`
      (func (export "t") (param i32)
        (get_local 0)
      )
    `);

    assert.equal(exports.t(v), v)
  });

});
