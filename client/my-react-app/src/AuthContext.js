import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('');

  const login = (user) => {
    // Perform your login logic and set the username
    setUsername(user);
  };

  const logout = () => {
    // Perform your logout logic and reset the username
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};