# Gammes Musicales

Une application web interactive pour apprendre et pratiquer les gammes musicales, quel que soit votre instrument.

![Logo de l'application](public/logo.png)

## Fonctionnalités

- 🎵 Visualisation des gammes sur partition avec notation musicale
- 👆 Doigtés personnalisables pour différents instruments
- 🎮 Mode pratique avec tempo ajustable
- 📄 Générateur de partitions pour l'impression
- 📱 Application installable sur mobile (PWA)

## Installation locale

\`\`\`bash
# Cloner le dépôt
git clone https://github.com/hauretax/gamme_trainer.git

# Accéder au répertoire
cd gamme_trainer

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
\`\`\`

## Déploiement sur GitHub Pages

1. Créez un dépôt GitHub nommé `gammes-musicales`
2. Poussez ce code vers votre dépôt
3. Le workflow GitHub Actions déploiera automatiquement l'application sur GitHub Pages

**Note importante**: Si vous souhaitez utiliser un nom de dépôt différent, modifiez la variable `basePath` dans `next.config.mjs` pour qu'elle corresponde au nom de votre dépôt.

## Auteur

Huggo Tricottet - [GitHub](https://github.com/hauretax) - [LinkedIn](https://www.linkedin.com/in/huggo-tricottet-3b19691a9/)

## Licence

Ce projet est sous licence MIT.
\`\`\`

Créons un fichier 404.html pour rediriger vers la page d'accueil en cas d'erreur 404 (important pour les applications SPA sur GitHub Pages) :

```html file="public/404.html"
&lt;!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirection vers la page d'accueil</title>
  <script>
    // Récupérer le chemin de base depuis l'URL actuelle
    const basePath = '/gammes-musicales'; // Remplacez par le nom de votre dépôt
    const path = window.location.pathname;
    
    // Rediriger vers la page d'accueil avec le chemin actuel en paramètre
    window.location.href = basePath + '/?path=' + encodeURIComponent(path.replace(basePath, ''));
  </script>
</head>
<body>
  <p>Redirection vers la page d'accueil...</p>
</body>
</html>
