'use strict';

const requiredMajor = 22;
const currentVersion = process.versions.node;
const currentMajor = Number.parseInt(currentVersion.split('.')[0], 10);

if (currentMajor !== requiredMajor) {
  console.error(
    `[FRONT-END] Node.js ${currentVersion} n'est pas la version attendue pour ce projet. ` +
      'Utilisez Node.js 22.x (version recommandée : 22.23.2).'
  );
  console.error('[FRONT-END] Avec nvm : nvm use 22.23.2');
  process.exit(1);
}
