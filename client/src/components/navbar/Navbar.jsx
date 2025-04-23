import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import Profile from "../profile/Profile";
import "./navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = localStorage.getItem("token");
  const user = useSelector((state) => state.user.user);
  const [userAvatar, setUserAvatar] = useState("assets/default-avatar.png");

  useEffect(() => {
    if (user && user.avatar) {
      setUserAvatar(`http://localhost:5000${user.avatar}?t=${Date.now()}`);
    }
  }, [user]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="assets/BarBoomPic6.png" alt="BarBoom Logo" className="logo-image" />
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
          </div>
        </div>
      )}

      <div className="auth-links">
        {isAuthenticated ? (
          <div className="signout-button" onClick={handleSignOut}>
            Signout
          </div>
        ) : (
          <div className="login-button" onClick={handleLogin}>
            Login
          </div>
        )}
      </div>

      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  );
};

export default Navbar;
