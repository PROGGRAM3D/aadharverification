import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log(aadhaarNumber, password)
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        aadhaarNumber: aadhaarNumber,
        password: password,
      },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

      if (response.status === 200) {
        alert('Login successful');
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your Aadhaar number and password.');
        alert('Login failed. Please check your Aadhaar number and password.');
      }
    } catch (error) {
      console.error(error);
      setError('Login failed. Please check your Aadhaar number and password.');
      alert('Login failed. Please check your Aadhaar number and password.');
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='wrapper'>
      {loading && <div className="loader"></div>}
      <h2>Login Form</h2>
      395593095919
      <form>
        <input
          type="number"
          value={aadhaarNumber}
          placeholder='Enter Aadhaar Number'
          onChange={(e) => setAadhaarNumber(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder='Enter Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={loginUser} disabled={loading}>Login</button>
        <p>Don't have an account? <Link to="/">Register</Link></p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;