import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<RegistrationForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );

}

export default App;
