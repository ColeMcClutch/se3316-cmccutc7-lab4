import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  // State for input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 

  // Function to handle login button click
  const handleLogin = async () => {
    console.log(email);
    console.log(password);
    console.log(username);
    if(email ==''){
      alert('Please enter an email')
    }
    if(password ==''){
      alert('Please enter a password')
    }
    if(username ==''){
      alert('Please enter a username')
    }else{
    try {
      console.log('Logging in with:', { username, email, password });
      const loginResponse = await fetch(`/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
      email,
      password,
      nickname: username,
      }),
    });
      if (loginResponse.ok) {
        //if admin logs in
        if(username=='admin'){
          console.log('Welcome Admin');
          navigate('/admin'); // Navigate to the admin view

        }else{//Other users
          console.log('Login successful');
          navigate('/authenticated'); // Navigate to the authenticated view
        }

      } else {
        console.log('Login failed: ', loginResponse.status + loginResponse.statusText);
        console.log('If Account is diabled, please contactor the admin user');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
  };

  // Function to handle signup button click
  const handleSignUp = async () => {
    console.log(email);
    console.log(password);
    console.log(username);
    try {
      console.log('Signing up with:', { username, email, password });
      const signUpResponse = await fetch(`/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nickname: username,
        }),
      });

      if (signUpResponse.ok) {
        console.log(signUpResponse);
        const data = await signUpResponse.json();
        console.log(data);
        alert(`New Account Added! Welcome ${username}! After verification, You may login now`);
      } else {
        console.error('Registration failed:', signUpResponse.status, signUpResponse.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="container">
      <div className="white-box">
        <h2>Cole's list of heroes</h2>
        <p>After completing the login process, you will be able to perform different organizing functions between the heroes in this database</p>

        {/* Three text inputs */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Two buttons */}
        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;