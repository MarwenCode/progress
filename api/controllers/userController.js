import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Pour vérifier les données envoyées
      const { username, email, password } = req.body;
  
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }
  
      // Créer un nouvel utilisateur
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      // Générer un token JWT
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      res.status(201).json({ message: "Utilisateur créé avec succès", token });
    } catch (error) {
      console.error("Error in registerUser:", error); // Afficher l'erreur s'il y en a une
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
  


// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token in the response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
