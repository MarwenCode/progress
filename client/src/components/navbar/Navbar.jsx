import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney, faUser } from "@fortawesome/free-solid-svg-icons";
import Profile from "../profile/Profile";
import "./navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const isAuthenticated = !!user;
  const [userAvatar, setUserAvatar] = useState(null);
  const [showAvatarIcon, setShowAvatarIcon] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && user.avatar && user.avatar !== "" && user.avatar !== "/assets/default-avatar.png" && user.avatar !== "assets/default-avatar.png") {
      if (user.avatar.startsWith("http")) {
        setUserAvatar(user.avatar);
        setShowAvatarIcon(false);
      } else {
        setUserAvatar(`http://localhost:5000${user.avatar}?t=${Date.now()}`);
        setShowAvatarIcon(false);
      }
    } else {
      setUserAvatar(null);
      setShowAvatarIcon(true);
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
        <img src="/assets/stairs.png" alt="Steps Logo" className="logo-image" />
        <div className="steps-logo-text">
          <span>S</span>
          <span>T</span>
          <span>E</span>
          <span>P</span>
          <span>S</span>
        </div>
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
            {showAvatarIcon ? (
              <FontAwesomeIcon icon={faUser} className="user-avatar fa-user" />
            ) : (
              <img
                src={userAvatar}
                alt="User Avatar"
                className="user-avatar"
                onError={() => {
                  setShowAvatarIcon(true);
                }}
              />
            )}
            <span className="user-name">{user?.username}</span>
          </div>
        </div>
      )}

      <div className="auth-links">
        {isAuthenticated ? (
          <>
           
            <div className="signout-button" onClick={handleSignOut}>
              Signout
            </div>
          </>
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
