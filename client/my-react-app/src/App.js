// App.js or main component
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login.js';
import AuthenticatedView from './AuthenticatedView/AuthenticatedView.js';
import AdminView from './AdminView/AdminView.js';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/authenticated" element={<AuthenticatedView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
};

export default App;