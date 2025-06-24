import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Password is required only if not using Google auth
      }
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    avatar: {
      type: String,
      default: "assets/default-avatar.png" // Chemin par défaut si l'utilisateur n'a pas téléversé d'avatar
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    }
  },
  {
    timestamps: true // Ajoute automatiquement les champs createdAt et updatedAt
  }
);

// Exportation du modèle User
export default mongoose.model("User", userSchema);
