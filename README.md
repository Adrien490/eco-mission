# Eco-Mission : Objectif Zéro Déchet

Un jeu éducatif pour apprendre à trier les déchets tout en s'amusant.

## Nouvelles fonctionnalités

Le jeu a été amélioré avec les fonctionnalités suivantes :

### Visuelles

- Illustrations vectorielles SVG à la place des emojis pour une meilleure cohérence visuelle
- Effets de particules lorsqu'un objet est correctement trié (confettis verts)
- Arrière-plan immersif avec des éléments naturels qui réagissent au score
- Animations de transition entre les niveaux

### Fonctionnelles

- Système de power-ups (ralentissement temporaire, tri automatique, points doublés, etc.)
- Événements spéciaux (pluie d'objets, objets bonus)
- Sauvegarde des scores et progrès du joueur (localStorage)
- Plus grande variété de déchets avec différentes formes et tailles

### Interface utilisateur

- Tutoriel interactif pour les nouveaux joueurs
- Barre de progression de niveau plus visible
- Feedback visuel lors du tri (animations plus distinctes)
- Sons et vibrations pour renforcer le feedback

### Contenu

- Intégration de faits écologiques réels pendant le jeu
- Système de points et de CO2 économisé amélioré

## Comment jouer

1. Choisissez un niveau de difficulté
2. Des objets vont tomber du haut de l'écran
3. Faites glisser les objets vers le bon conteneur (Recycler, Déchets, Réutiliser)
4. Collectez des power-ups pour vous aider
5. Progressez à travers les niveaux de plus en plus difficiles

## Sons

Pour une expérience complète, vous devez ajouter des fichiers sons dans le dossier `public/sounds/` :

- correct-sort.mp3
- wrong-sort.mp3
- level-up.mp3
- power-up.mp3
- game-over.mp3
- item-drop.mp3
- click.mp3
- background-music.mp3

## Technologies utilisées

- React.js
- Next.js
- Framer Motion
- Tailwind CSS
- localStorage API
- Web Audio API
- Vibration API
