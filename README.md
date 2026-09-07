# Aurore Salavert — Front-end

Application Angular 16 du site Aurore Salavert.

## Prérequis

- Node.js 18.x (version recommandée : 18.20.8) et npm
- le back-end local démarré sur <http://127.0.0.1:1338>

Angular 16 n'est pas compatible avec Node.js 24 ou 26. Installer une fois la version déclarée dans `.nvmrc`, puis installer les dépendances :

```bash
nvm install 18.20.8
npm ci
```

La commande `start:local` détecte ensuite automatiquement un Node 18 installé par nvm ou nvm-windows et lance Angular avec ce runtime. Il n'est pas nécessaire d'exécuter `nvm use` avant chaque démarrage.

Si Node 18 est installé dans un autre emplacement, indiquer son exécutable avec la variable `LOCAL_FRONTEND_NODE_BINARY`.

Exemple PowerShell :

```powershell
$env:LOCAL_FRONTEND_NODE_BINARY = 'C:\chemin\vers\node.exe'
npm run start:local
```

## Démarrer et développer localement

```bash
npm run start:local
```

Le serveur de développement est disponible sur <http://127.0.0.1:4200>. Il utilise la configuration Angular `development`, appelle l'API locale et recharge automatiquement la page après une modification du code source.

Pour travailler sur le back-end et le front-end en même temps, utiliser deux terminaux depuis la racine du dépôt :

Attention : le back-end requiert Node.js 24.x tandis que ce front-end Angular 16 requiert Node.js 18.x. Les deux commandes `start:local` sélectionnent elles-mêmes un runtime compatible lorsqu'il est installé.

```bash
# Terminal 1
cd aurore-salavert_back-end
npm run start:local
```

```bash
# Terminal 2
cd aurore-salavert_front-end
npm run start:local
```

## Construire localement

### Build de production

```bash
npm run build
```

Cette commande crée le build optimisé dans `dist/aurore-salavert_front-end`, génère le sitemap et copie `robots.txt`. Le build utilise l'API de production configurée dans `src/environments/environment.prod.ts`.

### Build de développement en continu

```bash
npm run watch
```

Cette commande reconstruit l'application avec la configuration locale à chaque modification, sans démarrer de serveur web.

## À propos de `npm start`

```bash
npm start
```

Cette commande sert le build déjà présent dans `dist/` avec Express et force une redirection HTTPS. Elle est prévue pour l'hébergement, pas pour le développement local. Utiliser `npm run start:local` sur un poste de développement.

Pour une vue d'ensemble des environnements, consulter [ENVIRONMENTS.md](../ENVIRONMENTS.md).
