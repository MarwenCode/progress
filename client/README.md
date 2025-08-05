Une application web MERN (MongoDB, Express, React, Node.js) pour suivre ses objectifs (quotidiens, hebdomadaires, mensuels).

✨ Objectifs du projet

Suivre ses tâches et objectifs de façon personnalisée

Créer un dashboard clair et intuitif pour l'utilisateur

Tester des outils modernes : React + Redux, Authentification Google, API REST avec Express

Expérimenter une architecture scalable

📊 Fonctionnalités principales

Authentification Google (OAuth2 via Passport.js)

Gestion des tâches et objectifs (jour/semaine/mois)

Sauvegarde MongoDB avec Mongoose

UI réactive avec React + SCSS

Gestion d'état globale avec Redux Toolkit

Upload de fichiers via multer

Animation avec Framer Motion et Lottie

📂 Structure du projet


├── api/                  # Backend Express
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/         # Uploads fichiers utilisateurs
│   ├── server.js
│   └── .env
│
├── client/               # Frontend React (Vite)
    ├── src/
    │   ├── components/  # Réutilisables (navbar, sidebar, etc)
    │   ├── pages/       # Pages (daily, weekly, monthly, home...)
    │   ├── redux/       # Redux slices par type de donnée
    │   └── App.jsx / main.jsx
    ├── public/
    └── index.html

🚀 Lancer le projet

Backend (API Node.js)

cd api
npm install
npm run dev

Frontend (Vite + React)

cd client
npm install
npm run dev

🛠️ Stack technique

Frontend : React 18, Redux Toolkit, React Router DOM, SCSS, Vite, Framer Motion, Lottie

Backend : Node.js, Express, MongoDB (Mongoose), JWT, Passport Google OAuth2

Autres : Multer, Axios, ESLint