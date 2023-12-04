// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login.js';
import AuthenticatedView from './AuthenticatedView/AuthenticatedView.js';
import AdminView from './AdminView/AdminView.js';
import { AuthProvider } from './AuthContext'; // Adjust the import path

const App = () => {
  const [loggedInUsername, setLoggedInUsername] = useState('');

  useEffect(() => {
    // Check if there's a username in localStorage
    const storedUsername = localStorage.getItem('loggedInUsername');
    if (storedUsername) {
      setLoggedInUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setLoggedInUsername(username);
  };

  return (
    <AuthProvider>
      <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/authenticated" element={<AuthenticatedView username={loggedInUsername} />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;