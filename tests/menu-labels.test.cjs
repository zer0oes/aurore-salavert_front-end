const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/app/services/menu-labels.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const context = { exports: {} };
vm.runInNewContext(compiled.outputText, context);
const apply = (...args) => JSON.parse(JSON.stringify(context.exports.applyMenuLabels(...args)));
const sections = [
  { title: 'Creative Showcase', slug: 'creative-showcase', labelField: 'ShowcaseLabel' },
  { title: 'Mes compétences', slug: 'what-i-can-do', labelField: 'SkillsLabel' }
];

test('editorial labels preserve entered casing and section destinations', () => {
  const result = apply(sections, { data: { HomeLabel: 'Bienvenue', ShowcaseLabel: 'Mes créations', SkillsLabel: 'Savoir-faire' } }, 'fr');
  assert.deepEqual(result, [
    { title: 'Bienvenue', slug: 'home' },
    { title: 'Mes créations', slug: 'creative-showcase' },
    { title: 'Savoir-faire', slug: 'what-i-can-do' }
  ]);
  assert.equal(sections[0].title, 'Creative Showcase');
});

test('missing, unpublished or inaccessible menu keeps the existing navigation', () => {
  for (const response of [undefined, { data: null }, { data: {} }]) {
    assert.equal(apply(sections, response, 'fr')[0].title, 'Accueil');
    assert.equal(apply(sections, response, 'en')[0].title, 'Home');
    assert.equal(apply(sections, response, 'fr')[1].title, 'Creative Showcase');
  }
});

test('empty fields fall back individually and legacy wrapped responses are supported', () => {
  const result = apply(sections, { data: { attributes: { HomeLabel: '', ShowcaseLabel: '   ', SkillsLabel: 'Expertise' } } }, 'en');
  assert.deepEqual(result.map(item => item.title), ['Home', 'Creative Showcase', 'Expertise']);
});
