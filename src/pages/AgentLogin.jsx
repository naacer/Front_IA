// src/pages/AgentLogin.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../services/AuthService';
import '../components/LoginForm.css';
 
const AgentLogin = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  const handleAgentLogin = async (credentials) => {
    try {
      const agent = await login(credentials, "Agent_dashbord__c");
      console.log('Agent logged in:', agent);

      // Stockez les informations du superviseur dans le stockage local
      localStorage.setItem('Agent', JSON.stringify(agent));

      // Redirigez vers la page SupervisorDashboard
      navigate(`/Dashboard/${agent.Id}`);
    } catch (error) {
      alert('Email or password not found');
    }
  };

  return (
    <div className="login-page">
      <div className="login-image"/>
      <div className="login-form-container">
        <h1 className="text-3xl font-bold text-center pb-4 textStyle">Agent Login</h1>
        <LoginForm onLogin={handleAgentLogin} />
        <Link to="/supervisor-login">Sign in as a Supervisor</Link>
      </div>
    </div>
  );
};

export default AgentLogin;
