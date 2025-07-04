import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import Profile from "../profile/Profile";
import "./navbar.scss";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const STATIC_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const isAuthenticated = !!user;
  const [userAvatar, setUserAvatar] = useState("/assets/default-avatar.png");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  useEffect(() => {
    if (user && user.avatar) {
      if (user.avatar.startsWith("http")) {
        setUserAvatar(user.avatar);
      } else {
        setUserAvatar(`${STATIC_URL}${user.avatar}?t=${Date.now()}`);
      }
    } else {
      setUserAvatar("/assets/default-avatar.png");
    }
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
    setAuthDropdownOpen(false);
  };

  const handleRegister = () => {
    navigate("/register");
    setAuthDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="assets/steps.png" alt="Steps Logo" className="logo-image" />
      </div>

      <div className="nav-pages">
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => navigate("/features")}>Features</span>
        <span onClick={() => navigate("/pricing")}>Pricing</span>
      </div>

      {isAuthenticated && (
        <div className="icons-cards">
          <div className="card daily" onClick={() => navigate("/daily")}>
            <p>D</p>
          </div>
          <div className="card weekly" onClick={() => navigate("/weekly")}>
            <p>W</p>
          </div>
          <div className="card monthly" onClick={() => navigate("/monthly")}>
            <p>M</p>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="nav-icons">
          <div className="nav-item" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faHouseChimney} />
          </div>
          <div className="nav-item" onClick={() => setIsProfileOpen(true)}>
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />
            <span className="user-name">{user?.username}</span>
          </div>
        </div>
      )}

      <div className="auth-links">
        {isAuthenticated ? (
          <div className="signout-button" onClick={handleSignOut}>
            Signout
          </div>
        ) : (
          <div
            className="auth-dropdown"
            onMouseEnter={() => setAuthDropdownOpen(true)}
            onMouseLeave={() => setAuthDropdownOpen(false)}
          >
            <div className="auth-button">Sign In ▾</div>
            {authDropdownOpen && (
              <div className="dropdown-menu">
                <div onClick={handleLogin}>Login</div>
                <div onClick={handleRegister}>Register</div>
              </div>
            )}
          </div>
        )}
      </div>

      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  );
};

export default Navbar;
