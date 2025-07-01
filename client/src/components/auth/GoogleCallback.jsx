import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice/authSlice';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    console.log('GoogleCallback - Token:', token ? 'Present' : 'Missing');
    console.log('GoogleCallback - Error:', error);

    if (error) {
      console.error('Google authentication error:', error);
      navigate('/login?error=Authentication failed');
      return;
    }

    if (token) {
      // Fetch user info from /me using the token
      const fetchUserInfo = async () => {
        try {
          console.log('Fetching user info with token...');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          
          const response = await axios.get(`${API_URL}/me`, config);
          const userData = response.data;
          console.log('User data received:', userData);
          
          // Store the full user object (including token) in localStorage
          const userWithToken = { ...userData, token };
          localStorage.setItem('user', JSON.stringify(userWithToken));
          
          // Update Redux state with the full user object (authSlice)
          dispatch(login(userWithToken));
          
          // Redirect to home page
          navigate('/');
        } catch (error) {
          console.error('Error fetching user info:', error.response?.data || error.message);
          navigate('/login?error=Authentication failed');
        }
      };
      fetchUserInfo();
    } else {
      console.error('No token found in URL');
      navigate('/login?error=Authentication failed');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing authentication...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default GoogleCallback; 