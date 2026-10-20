const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/app/components/menu/menu.component.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } });

function setup(home) {
  const calls = { navigations: 0, scrolls: [], urls: [], prevented: false };
  const context = {
    exports: {}, require: () => ({ Component: () => target => target }),
    document: {
      getElementById: () => ({ getBoundingClientRect: () => ({ top: 300 }) }),
      body: { scrollTop: 100, getBoundingClientRect: () => ({ top: 20 }), scrollTo: value => calls.scrolls.push(value) }
    }
  };
  vm.runInNewContext(compiled.outputText, context);
  const router = {
    url: home ? '/#home' : '/project/example',
    parseUrl: () => ({ root: { children: { primary: { segments: home ? [] : ['project', 'example'] } } } }),
    serializeUrl: tree => '/#' + tree.fragment,
    navigate: () => { calls.navigations++; return Promise.resolve(true); }
  };
  const menu = new context.exports.MenuComponent(router, { setMenuOpened: value => { calls.opened = value; } }, { go: url => calls.urls.push(url) });
  menu.menuOpened = true;
  const event = { button: 0, preventDefault: () => { calls.prevented = true; } };
  return { menu, calls, event };
}

test('home section click closes menu and scrolls without any router navigation', () => {
  const { menu, calls, event } = setup(true);
  menu.navigateToSection('creative-showcase', event);
  assert.equal(calls.navigations, 0);
  assert.equal(menu.menuOpened, false);
  assert.equal(calls.opened, false);
  assert.equal(calls.prevented, true);
  assert.deepEqual(calls.urls, ['/#creative-showcase']);
  assert.equal(calls.scrolls[0].behavior, 'smooth');
  assert.equal(calls.scrolls[0].top, 300);
});

test('from a project page, navigation to home still happens before scrolling', async () => {
  const { menu, calls, event } = setup(false);
  menu.navigateToSection('creative-showcase', event);
  assert.equal(calls.navigations, 1);
  assert.equal(calls.scrolls.length, 0);
  await Promise.resolve();
  assert.equal(calls.scrolls.length, 1);
});

test('modified clicks retain native link behavior', () => {
  const { menu, calls, event } = setup(true);
  event.ctrlKey = true;
  menu.navigateToSection('home', event);
  assert.equal(calls.prevented, false);
  assert.equal(calls.navigations, 0);
  assert.equal(calls.scrolls.length, 0);
});
