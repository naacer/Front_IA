import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../services/AuthService';
import '../components/LoginForm.css';

const SupervisorLogin = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSupervisorLogin = async (credentials) => {
    try {
      const supervisor = await login(credentials, "supervisor_db__c");
      console.log('Supervisor logged in:', supervisor);

      // Stockez les informations du superviseur dans le stockage local
      localStorage.setItem('supervisor', JSON.stringify(supervisor));

      // Redirigez vers la page SupervisorDashboard
      navigate(`/supervisorDashboard/${supervisor.Id}`);
    } catch (error) {
      alert('Email or password not found');
    }
  };

  return (
    <div className="login-page">
      <div className="login-image" />
      <div className="login-form-container">
        <h1 className="text-3xl font-bold text-center pb-4 textStyle">Supervisor Login</h1>
        <LoginForm onLogin={handleSupervisorLogin} />
        <Link to="/">Sign in as an Agent</Link>
      </div>
    </div>
  );
};

export default SupervisorLogin;
