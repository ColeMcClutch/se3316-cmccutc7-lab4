import React from 'react';
import Login from './login/login.js'; // Capitalized
import AdminPage from  './adminMainPage/adminMainPage.js';
import ListMenu from  './ListMenu/listMenu.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Login /> {/* Capitalized */}
    </div>
  );
};

export default App;
/*<ListMenu /> {/* Capitalized */