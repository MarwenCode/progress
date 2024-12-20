import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <img 
        src="assets/logoBarBoom.jpg" 
        alt="logo" 
        className="logo-image" 
        onClick={() => navigate('/')}
      />
      <div className="sign-out">Sign Out</div>
    </nav>
  );
};

export default Navbar;

