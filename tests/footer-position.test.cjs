const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/app/components/footer/footer-position.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { exports: {} };
vm.runInNewContext(compiled.outputText, context);
const { privacyRevealOffset } = context.exports;

test('initial page and return to top keep the footer at the bottom, including before content loads', () => {
  assert.equal(privacyRevealOffset(0, 667, 20, 37, 20), 0);
  assert.equal(privacyRevealOffset(-10, 667, 20, 37, 20), 0);
});

test('scrolling through page content does not raise the footer', () => {
  assert.equal(privacyRevealOffset(500, 667, 1000, 37, 20), 0);
});

test('footer rises with the privacy section entering the viewport', () => {
  assert.equal(privacyRevealOffset(2000, 667, 647, 37, 20), 20);
  assert.equal(privacyRevealOffset(2037, 667, 610, 37, 20), 57);
});

test('stale layout measurements cannot move the footer to the top of the screen', () => {
  assert.equal(privacyRevealOffset(500, 667, 20, 37, 20), 57);
  assert.equal(privacyRevealOffset(500, 667, 20, 0, 20), 0);
});
