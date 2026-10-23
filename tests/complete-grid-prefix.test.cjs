const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../src/app/shared/layout/project-list/complete-grid-prefix.ts'), 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const count = layouts => context.exports.completeGridPrefix(layouts.map(layout => ({ layout })));
test('hides an incomplete last row and retains full rows', () => {
  assert.equal(count(Array(8).fill('')), 6);
  assert.equal(count(Array(9).fill('')), 9);
  assert.equal(count(['']), 0);
  assert.equal(count([]), 0);
});
test('accounts for wide tiles and dense backfilling', () => {
  assert.equal(count(['double-horizontal', 'double-horizontal', '', '']), 4);
  assert.equal(count(['double-horizontal', '']), 2);
});
test('does not leave a vertical tile crossing into an incomplete row', () => {
  assert.equal(count(['', '', '', 'double-vertical', '', '']), 3);
  assert.equal(count(['double-vertical', '', '', '', '']), 5);
});
