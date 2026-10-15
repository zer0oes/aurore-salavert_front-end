const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/app/overlay-scrollbars.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const context = { exports: {} };
vm.runInNewContext(compiled.outputText, context);
const { scrollbarGeometry } = context.exports;

test('mobile browser chrome and footer constrain the whole handle', () => {
  const geometry = scrollbarGeometry(20, 720, 916, 2556, 2556 - 916);
  assert.equal(geometry.start + geometry.length, 720);
  assert.ok(geometry.length < 200);
  assert.equal(geometry.track, 700);
});

test('scroll progress remains mapped to the actual scroll range', () => {
  const first = scrollbarGeometry(20, 720, 916, 2556, 0);
  const middle = scrollbarGeometry(20, 720, 916, 2556, (2556 - 916) / 2);
  assert.equal(first.start, 20);
  assert.equal(middle.start, 20 + (700 - middle.length) / 2);
  assert.equal(middle.ratio * (700 - middle.length), 2556 - 916);
});

test('overscroll cannot move the handle beyond its visible track', () => {
  const before = scrollbarGeometry(20, 720, 916, 2556, -100);
  const after = scrollbarGeometry(20, 720, 916, 2556, 9999);
  assert.equal(before.start, 20);
  assert.equal(after.start + after.length, 720);
});

test('fully clipped and short tracks never produce an oversized handle', () => {
  const hidden = scrollbarGeometry(800, 720, 916, 2556, 300);
  const tiny = scrollbarGeometry(700, 712, 916, 2556, 300);
  assert.equal(hidden.track, 0);
  assert.equal(hidden.length, 0);
  assert.equal(tiny.length, 12);
});
