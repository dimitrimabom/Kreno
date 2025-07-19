# Kreno 🏢

Une application moderne de gestion de réservation de salles de réunion, construite avec Next.js, TypeScript et Prisma.

## 📋 Description

Kreno est une plateforme web qui simplifie la gestion et la réservation de salles de réunion. L'application permet aux utilisateurs de créer un compte, réserver des salles et gérer leurs réservations de manière intuitive.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec Kinde Auth
- 📅 **Réservation de salles** simple et intuitive
- 👥 **Gestion des utilisateurs** avec profils personnalisés
- 📱 **Interface responsive** adaptée à tous les appareils
- 🎨 **Design moderne** avec Tailwind CSS

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Base de données**: SQLite avec Prisma ORM
- **Authentification**: Kinde Auth
- **UI Components**: Radix UI, Lucide React
- **Développement**: Turbopack

## 🚀 Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/dimitrimabom/Kreno.git
   cd kreno
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

   ```env
   DATABASE_URL="file:./dev.db"
   KINDE_CLIENT_ID="votre-client-id"
   KINDE_CLIENT_SECRET="votre-client-secret"
   KINDE_ISSUER_URL="votre-issuer-url"
   KINDE_SITE_URL="http://localhost:3000"
   KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
   KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/dashboard"
   ```

4. **Initialiser la base de données**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
kreno/
├── app/                    # Pages et API routes Next.js
│   ├── api/               # Routes API
│   │   ├── auth/          # Authentification Kinde
│   │   └── users/         # Gestion des utilisateurs
│   ├── dashboard/         # Page tableau de bord
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React réutilisables
│   ├── Step.tsx          # Composant d'étapes
│   └── ui/               # Composants UI
├── lib/                   # Utilitaires et configuration
│   ├── prisma.ts         # Client Prisma
│   └── utils.ts          # Fonctions utilitaires
├── prisma/               # Schéma et migrations de base de données
│   └── schema.prisma     # Modèles de données
└── public/               # Assets statiques
```

## 🗄️ Modèle de données

L'application utilise Prisma avec SQLite et inclut actuellement :

- **User**: Gestion des utilisateurs avec email, nom et prénom

## 🎯 Utilisation

1. **Créer un compte** : Utilisez le bouton "S'inscrire" sur la page d'accueil
2. **Se connecter** : Accédez à votre compte via le bouton "Se connecter"
3. **Réserver une salle** : Naviguez vers le tableau de bord pour gérer vos réservations
4. **Gérer les réservations** : Consultez et modifiez vos réservations existantes

## 🧪 Scripts disponibles

- `npm run dev` - Lance le serveur de développement avec Turbopack
- `npm run build` - Compile l'application pour la production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés © 2025 Kreno.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

---

**Kreno** - Simplifiez la gestion de vos salles de réunion ! 🚀
