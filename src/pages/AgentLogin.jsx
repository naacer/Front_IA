// src/pages/AgentLogin.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../services/AuthService';
import '../components/LoginForm.css';
 
const AgentLogin = () => {
  const handleAgentLogin = async (credentials) => {
    try {
      const agent = await login(credentials,"Agents_db__c");
      console.log('Agent logged in:', agent);
  
      // Stockez les informations de l'agent dans le stockage local ou le contexte global
      localStorage.setItem('agent', JSON.stringify(agent));
  
      // Redirigez vers la page dédiée à l'agent
      window.location.href = `/agent-dashboard/${agent.Id}`;
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
