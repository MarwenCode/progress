import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir le chemin correct pour le répertoire "uploads" à la racine du projet
const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuration Multer pour le téléversement
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage }); // Middleware Multer

// Middleware d'authentification
export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le token
    req.user = decoded; // Ajouter les informations décodées à req.user

    // Récupérer l'utilisateur à partir de la base de données
    User.findById(decoded.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        req.user = user; // Ajouter l'utilisateur à req.user
        next(); // Passer au contrôleur suivant
      })
      .catch(error => {
        console.error('Erreur dans authenticateUser :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      });
  } catch (error) {
    console.error('Erreur dans authenticateUser :', error);
    res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

// Contrôleur pour l'inscription
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification des champs requis
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Création du nouvel utilisateur
    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Utilisateur créé avec succès.', token });
  } catch (error) {
    console.error('Erreur dans registerUser :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Contrôleur pour la connexion
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email reçu :", email);
    console.log("Mot de passe reçu :", password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Utilisateur non trouvé pour l'email :", email);
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Comparaison du mot de passe
    if (user.password !== password) {
      console.log("Mot de passe incorrect pour l'utilisateur :", email);
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Connexion réussie.', token });
  } catch (error) {
    console.error('Erreur dans loginUser :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur pour récupérer le profil de l'utilisateur
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur dans getUserProfile :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur pour la mise à jour du profil
export const updateUserProfile = async (req, res) => {
  try {
    console.log("Fichier reçu :", req.file); // Vérifiez que le fichier est bien reçu
    console.log("Données reçues :", req.body);

    const userId = req.user._id;
;
    const { username, email, password } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (password) {
      user.password = password; // Stocker le mot de passe en clair
    }

    await user.save();
    res.status(200).json({ message: "Profil mis à jour avec succès.", user });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Contrôleur pour la suppression du profil
export const deleteUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: 'Utilisateur non authentifié ou non trouvé.' });
    }

    const userId = req.user.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ message: 'Compte supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur dans deleteUserProfile :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
