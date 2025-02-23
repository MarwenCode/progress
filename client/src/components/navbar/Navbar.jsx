import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Récupère l'état de l'utilisateur du store Redux
  const { user } = useSelector((state) => state.user);

  const handleSignOut = () => {
    // Dispatch l'action pour se déconnecter (tu devras l'ajouter dans ton reducer)
    dispatch(logout());
    navigate('/login'); // Redirige vers la page de login après déconnexion
  };

  const handleLogin = () => {
    navigate('/login'); // Redirige vers la page de login
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        {/* Option d'affichage du logo */}
        <img src="assets/BarBoomPic6.png" alt="BarBoom Logo" className="logo-image" />
      </div>
      <div className="auth-links">
        {user ? (
          // Si l'utilisateur est connecté, afficher "Sign Out"
          <div className="sign-out" onClick={handleSignOut}>
            Sign Out
          </div>
        ) : (
          // Si l'utilisateur n'est pas connecté, afficher "Login"
          <div className="login" onClick={handleLogin}>
            Login
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
