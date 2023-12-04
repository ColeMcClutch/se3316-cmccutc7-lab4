// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login.js';
import AuthenticatedView from './AuthenticatedView/AuthenticatedView.js';
import AdminView from './AdminView/AdminView.js';
import { AuthProvider } from './AuthContext'; // Adjust the import path

const App = () => {
  const [loggedInUsername, setLoggedInUsername] = useState('');

  const handleLogin = (username) => {
    setLoggedInUsername(username);
  };

  return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/authenticated"
          element={<AuthProvider><AuthenticatedView username={loggedInUsername} /></AuthProvider>}
        />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
  );
};

export default App;