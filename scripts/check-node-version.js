'use strict';

const requiredMajor = 18;
const currentVersion = process.versions.node;
const currentMajor = Number.parseInt(currentVersion.split('.')[0], 10);

if (currentMajor !== requiredMajor) {
  console.error(
    `[FRONT-END] Node.js ${currentVersion} n'est pas compatible avec Angular 16. ` +
      'Utilisez Node.js 18.x (version recommandée : 18.20.8).'
  );
  console.error('[FRONT-END] Avec nvm : nvm use 18.20.8');
  process.exit(1);
}
