import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile, deleteUserProfile } from "../../redux/userSlice/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./profile.scss";

const Profile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.user.isLoading);

  // States for the form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("assets/default-avatar.png");
  const [showPassword, setShowPassword] = useState(false);

  // Update form fields with user data
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPreviewAvatar(user.avatar ? `http://localhost:5000${user.avatar}` : "assets/default-avatar.png");
      setPassword(user.password); // Set the current password
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

      if (updateUserProfile.fulfilled.match(resultAction)) {
        console.log("✅ Profile updated successfully:", resultAction.payload);
        // Update avatar after success
        if (resultAction.payload.avatar) {
          setPreviewAvatar(`http://localhost:5000${resultAction.payload.avatar}`);
        }
      } else {
        console.error("❌ Error updating profile:", resultAction.payload);
      }
    } catch (error) {
      console.error("❌ Error while updating profile:", error);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
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
        <button className="close-button" onClick={onClose}>X</button>

        {/* Avatar Section */}
        <div className="avatar-section">
          <img src={previewAvatar} alt="Avatar" className="avatar" />
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
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

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
        <button className="delete-button" onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
