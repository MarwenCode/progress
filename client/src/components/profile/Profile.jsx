import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { updateProfile, deleteProfile } from "../../redux/userSlice/UserSlice";
import "./profile.scss";

const Profile = ({ isOpen, onClose }) => {
  // const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || "assets/default-avatar.png");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
    }
  }, [user]);

  // const handleUpdate = (e) => {
  //   e.preventDefault();
  //   const updatedData = { name, email, avatar };
  //   if (password) updatedData.password = password;
  //   dispatch(updateProfile(updatedData));
  // };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      console.log("Profile deleted"); 
      // dispatch(deleteProfile()); // Uncomment this when the delete functionality is implemented
    }
  };

  if (!isOpen) return null; // Do not render if the modal is closed

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>My Profile</h2>
        <button className="close-button" onClick={onClose}>X</button>
        <div className="avatar-section">
          <img src={avatar} alt="Avatar" className="avatar" />
          {/* <input type="file" accept="image/*" onChange={handleAvatarChange} /> */}
        </div>
        <form>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <label>New Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank if unchanged" />
          
          <button type="submit">Update Profile</button>
        </form>

        {/* Delete Profile Button */}
        <button className="delete-button" onClick={handleDelete}>Delete My Profile</button>
      </div>
    </div>
  );
};

export default Profile;
