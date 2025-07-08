import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse token from URL (e.g., /auth/google/callback?token=...)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Fetch user profile with the token
      axios
        .get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = { ...res.data.user, token };
          localStorage.setItem("user", JSON.stringify(user));
          dispatch(login(user));
          navigate("/"); // Redirect to home or dashboard
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      // Handle error
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return <div>Authenticating...</div>;
};

export default GoogleCallback; 