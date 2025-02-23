import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/userSlice/UserSlice";
import { useNavigate } from "react-router-dom";
import "./register.scss"

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/"); // Redirige après inscription
      }
    });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Inscription</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className={isLoading ? "disabled" : "register-button"} disabled={isLoading}>
            {isLoading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
