import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserProfile,
  deleteUserProfile,
} from "../../redux/userSlice/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";

import "./profile.scss";

const Profile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.user.isLoading);
  const isError = useSelector((state) => state.user.isError);
  const message = useSelector((state) => state.user.message);

  console.log("PROFILE COMPONENT STATE:", { user, isLoading, isError, message });

  // States for the form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(
    "assets/default-avatar.png"
  );
  const [showPassword, setShowPassword] = useState(false);

  // Use the correct API URL for user actions
  const USER_API_URL = `${import.meta.env.VITE_API_URL}/user`;
  const STATIC_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

  // Update form fields with user data
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPassword(""); // Do not prefill password
      console.log("DEBUG AVATAR VALUE:", user.avatar);
      if (!user.avatar || user.avatar === "/assets/default-avatar.png" || user.avatar === "assets/default-avatar.png") {
        setPreviewAvatar("/assets/default-avatar.png");
      } else {
        setPreviewAvatar(`${STATIC_URL}${user.avatar}`);
      }
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      const resultAction = await dispatch(updateUserProfile(formData));
      console.log("Profile update resultAction:", resultAction);

      if (updateUserProfile.fulfilled.match(resultAction)) {
        // Success case - check if payload and user exist
        if (resultAction.payload && resultAction.payload.user) {
          if (resultAction.payload.user.avatar) {
            setPreviewAvatar(`${STATIC_URL}${resultAction.payload.user.avatar}`);
          }
          onClose();
        }
      } else if (updateUserProfile.rejected.match(resultAction)) {
        // Error case - show error message
        const errorMessage = resultAction.payload?.message || "Failed to update profile";
        console.error("❌ Error updating profile:", errorMessage);
      }
    } catch (error) {
      console.error("❌ Error while updating profile:", error);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      dispatch(deleteUserProfile());
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>My Profile</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>

        {/* Avatar Section */}
        <div className="avatar-section">
          {(!user.avatar || user.avatar === "/assets/default-avatar.png" || user.avatar === "assets/default-avatar.png") ? (
            <div
              className="letter-avatar"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#e05682",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: "bold",
                margin: "0 auto"
              }}
            >
              {user.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>
          ) : (
            <img src={previewAvatar} alt="Avatar" className="avatar" />
          )}
          <label htmlFor="avatar-upload" className="avatar-upload-label">
            <FontAwesomeIcon icon={faCamera} className="camera-icon" />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setAvatar(file);
                setPreviewAvatar(URL.createObjectURL(file));
              }
            }}
            style={{ display: "none" }}
          />
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdate}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Current Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank if unchanged"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Delete Button */}
        <button
          className="delete-button"
          onClick={handleDelete}
          title="Delete Account">
          <FontAwesomeIcon icon={faHeartBroken} />
        </button>

        {/* Error Message */}
        {isError && message && (
          <div className="error">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
