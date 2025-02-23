import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Ajoute automatiquement createdAt et updatedAt
);

// 🔹 Hash du mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Comparaison du mot de passe lors de la connexion
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔹 Export du modèle User
export default mongoose.model("User", userSchema);
