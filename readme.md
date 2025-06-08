# Système de Vérification d'E-mail Next.js 15 (App Router)

Ce projet implémente un système robuste de vérification d'adresse e-mail pour une application Next.js, en utilisant des technologies modernes et une architecture conteneurisée avec Docker Compose.

Il s'agit d'une solution complète comprenant :
-   **Next.js 15 (App Router)** comme framework frontend et backend (API Routes).
-   **PostgreSQL** pour la persistance des données utilisateur.
-   **Prisma** comme ORM (Object-Relational Mapper) pour une interaction facile et typée avec PostgreSQL.
-   **Redis** pour la gestion des codes de vérification éphémères (avec expiration).
-   **n8n** pour l'automatisation de l'envoi d'e-mails via un webhook.
-   **Docker Compose** pour orchestrer et isoler l'environnement de développement de tous les services.
-   **TypeScript** pour une meilleure qualité de code et une meilleure maintenabilité.

## Fonctionnalités

* **Inscription/Enregistrement d'utilisateur :** Enregistre une adresse e-mail dans PostgreSQL.
* **Génération de code de vérification :** Génère un code numérique unique.
* **Stockage sécurisé et temporaire du code :** Stocke le code dans Redis avec une durée de vie limitée (15 minutes).
* **Envoi d'e-mail automatisé :** Utilise un webhook n8n pour déclencher l'envoi de l'e-mail contenant le code de vérification.
* **Vérification de l'e-mail :** Valide le code soumis par l'utilisateur par rapport au code stocké dans Redis et met à jour le statut de l'utilisateur dans PostgreSQL.
* **Environnement conteneurisé :** Tous les services (Next.js, PostgreSQL, Redis) s'exécutent dans des conteneurs Docker via Docker Compose pour une reproductibilité et un déploiement facilités.
* **Typage fort :** Le projet est entièrement développé en TypeScript.

## Architecture
```
Directory Strusture
.
├── docker-compose.yml
├── email-verification-app
│   ├── app
│   ├── Dockerfile
│   ├── lib
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── prisma
│   ├── public
│   └── tsconfig.json
└── readme.md

7 directories, 10 files
```

## Technologies Utilisées

* **Frontend/Backend :** Next.js 15 (App Router)
* **Base de Données :** PostgreSQL
* **ORM :** Prisma
* **Cache/Temp data :** Redis
* **Automatisation E-mail :** n8n
* **Conteneurisation :** Docker, Docker Compose
* **Langage :** TypeScript
* **Gestion de packages :** npm

## Pré-requis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

* [Node.js](https://nodejs.org/) (v18.x ou plus, recommandé par Next.js)
* [npm](https://www.npmjs.com/get-npm) (généralement inclus avec Node.js)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour Docker et Docker Compose)
* Une instance [n8n](https://n8n.io/) en cours d'exécution (self-hosted ou cloud).
* Un compte SMTP pour l'envoi d'e-mails (ex: Gmail, SendGrid, Mailgun, Mailtrap.io pour le dev). mais Dans ce projet nous avons utiliser Gmail

## Installation et Démarrage

Suivez ces étapes pour mettre le projet en marche sur votre machine locale.

### 1. Clonage du Répertoire

```bash
git clone [https://github.com/votre-utilisateur/votre-repo.git](https://github.com/votre-utilisateur/votre-repo.git) # Remplacez par le vrai URL de votre repo
cd votre-repo # Accédez au répertoire racine du projet