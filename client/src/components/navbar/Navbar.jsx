import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        {/* Choose one of the following options for logo display: */}
        {/* Option 1: Text logo */}
        {/* BarBoom */} 
        {/* Option 2: Image logo */}
        <img src="assets/BarBoomPic6.png" alt="BarBoom Logo" className="logo-image" /> 
      </div>
      <div className="sign-out" onClick={() => { /* Handle sign-out logic here */ }}>
        Sign Out
      </div>
    </nav>
  );
};

export default Navbar;