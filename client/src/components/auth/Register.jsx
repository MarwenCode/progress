import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset, googleLogin } from '../../redux/authSlice/authSlice';
import { FcGoogle } from 'react-icons/fc';
import './auth.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth || {}
  );

  useEffect(() => {
    if (isError) {
      console.error('Register error:', message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    
    const userData = {
      username,
      email,
      password,
    };
    
    dispatch(register(userData));
  };

  const handleGoogleRegister = () => {
    dispatch(googleLogin());
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-form-box">
          <div className="text-center">
            <h2>Creating account...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2>Create your account</h2>
        
        {isError && (
          <div className="error-message">
            {message}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={onChange}
            />
          </div>
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: '#fff' }}>Or continue with</span>
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleGoogleRegister}
              className="google-btn"
              disabled={isLoading}
            >
              <FcGoogle size={20} style={{ marginRight: '8px' }} />
              <span>Sign up with Google</span>
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          <span style={{ color: '#fff' }}>
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
            >
              Sign in here
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register; 