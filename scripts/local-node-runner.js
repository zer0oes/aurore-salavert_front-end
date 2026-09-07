'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const appDir = path.resolve(__dirname, '..');
const requiredMajor = 18;
const preferredVersion = '18.20.8';

const candidateDirectories = [
  process.env.NVM_HOME,
  process.env.NVM_DIR && path.join(process.env.NVM_DIR, 'versions', 'node'),
  process.platform === 'win32' &&
    process.env.APPDATA &&
    path.join(process.env.APPDATA, 'nvm'),
  process.platform !== 'win32' && path.join(os.homedir(), '.nvm', 'versions', 'node'),
].filter(Boolean);

const versionDirectories = candidateDirectories.flatMap((directory) => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^v?18\./.test(entry.name))
    .sort((left, right) => right.name.localeCompare(left.name, undefined, { numeric: true }))
    .map((entry) => path.join(directory, entry.name));
});

const executableName = process.platform === 'win32' ? 'node.exe' : 'bin/node';
const candidates = [
  process.env.LOCAL_FRONTEND_NODE_BINARY,
  ...versionDirectories.map((directory) => path.join(directory, executableName)),
  process.execPath,
].filter((candidate, index, values) => candidate && values.indexOf(candidate) === index);

const getCompatibleVersion = (nodeBinary) => {
  if (!fs.existsSync(nodeBinary)) {
    return null;
  }

  const result = spawnSync(nodeBinary, ['--version'], { encoding: 'utf8' });
  const version = result.status === 0 ? result.stdout.trim().replace(/^v/, '') : '';
  return Number.parseInt(version.split('.')[0], 10) === requiredMajor ? version : null;
};

const compatibleRuntime = candidates
  .map((binary) => ({ binary, version: getCompatibleVersion(binary) }))
  .find((candidate) => candidate.version);

if (!compatibleRuntime) {
  console.error('[FRONT-END] Aucun runtime Node.js 18 compatible avec Angular 16 n’a été trouvé.');
  console.error(`[FRONT-END] Installez-le avec nvm : nvm install ${preferredVersion}`);
  console.error(
    '[FRONT-END] Si Node 18 est installé ailleurs, définissez LOCAL_FRONTEND_NODE_BINARY.'
  );
  process.exit(1);
}

const angularCli = path.join(appDir, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

if (!fs.existsSync(angularCli)) {
  console.error('[FRONT-END] Angular CLI est absent. Exécutez npm ci dans le dossier front-end.');
  process.exit(1);
}

console.log(
  `[FRONT-END] Runtime compatible : ${compatibleRuntime.binary} (v${compatibleRuntime.version})`
);

const result = spawnSync(
  compatibleRuntime.binary,
  [angularCli, 'serve', '--configuration', 'development', '--host', '127.0.0.1', '--port', '4200'],
  { cwd: appDir, env: process.env, stdio: 'inherit' }
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
