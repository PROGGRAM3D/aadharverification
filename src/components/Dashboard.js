import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserInfo(response.data.user);
          setIsAuthenticated(true);
        } 
        else {
          navigate('/login'); // Redirect to login page if not authenticated
        }
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);
  
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/logout', null, {
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate('/login');
      } else {
        console.error('Failed to logout');
        alert('Failed to logout')
      }
    } catch (error) {
      console.error('Error:', error.message);
      if (error.response && error.response.status === 404) {
        navigate('/login');

      } else {
        alert('Problem has occured !! ', error);
      }
    }
  };
  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : userInfo ? (
        <div>
          <p>Welcome, {userInfo.userName}!</p>
          <p>Aadhaar Number: {userInfo.userAadharNo}</p>
          <p>Account Address: {userInfo.userAccountAddress}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>Error fetching user info</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;