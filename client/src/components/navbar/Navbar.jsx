import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice/UserSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faUserCircle, faArrowRightFromBracket, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import Profile from "../profile/Profile"; // Importer la modal
import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = localStorage.getItem("token");

  const [isProfileOpen, setIsProfileOpen] = useState(false); // État pour la modal

  const handleSignOut = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        <img src="assets/BarBoomPic6.png" alt="BarBoom Logo" className="logo-image" />
      </div>

      {isAuthenticated && (
        <div className="nav-links">
          <div className="nav-item" onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faHouseChimney} />
          </div>
          <div className="nav-item" onClick={() => setIsProfileOpen(true)}>
            <FontAwesomeIcon icon={faUserCircle} />
          </div>
        </div>
      )}

      <div className="auth-links">
        {isAuthenticated ? (
          <div className="nav-item sign-out" onClick={handleSignOut}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
        ) : (
          <div className="nav-item login" onClick={handleLogin}>
            <FontAwesomeIcon icon={faArrowRightToBracket} />
          </div>
        )}
      </div>

      {/* Afficher la modal si isProfileOpen est true */}
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  );
};

export default Navbar;
