// AuthenticatedView.js
import React from 'react';
import ListMenu from '../ListMenu/listMenu.js';

const AuthenticatedView = ({username}) => {
  return (
    <div>
      <h1>Welcome to the authenticated view!</h1>
      <ListMenu username={{username}}/>
    </div>
  );
};

export default AuthenticatedView;