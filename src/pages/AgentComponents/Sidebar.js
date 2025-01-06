import React, { useState, useEffect } from 'react';
import { Paper, Avatar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate
import './Sidebar.css';

const Sidebar = () => {
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate(); // Initialisation du hook de navigation

  useEffect(() => {
    const storedAgent = localStorage.getItem('Agent');
    if (storedAgent) {
      setAgent(JSON.parse(storedAgent));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('Agent');
    navigate('/'); // Utilisation de navigate pour rediriger
  };

  if (!agent) {
    return <p>Loading...</p>;
  }

  return (
    <Paper className="sidebar-container">
      <div className="sidebar-header">
        <img
          alt={agent.Name}
          src={agent.image__c || '/default-avatar.png'}
          className="sidebar-avatar"
        />
        <Typography variant="h5" className="sidebar-name">{agent.Name}</Typography>
        <Typography variant="h6" color="textPrimary">{agent.Email_c__c}</Typography>
        <Typography variant="body2" color="textPrimary">{agent.Skills__c}</Typography>
      </div>
      <div className="sidebar-buttons">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="sidebar-button"
          onClick={() => navigate('/dashboard/:id/historique')}
        >
          Historique
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="sidebar-button"
          onClick={() => navigate('/dashboard/:id')}
        >
          Dashboard
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="sidebar-button"
          onClick={() => navigate('/dashboard/:id/emails-assignes')}
        >
          Emails assignés
        </Button>
      </div>
      <div className="sidebar-footer">
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleLogout}
          className="sidebar-logout"
        >
          Logout
        </Button>
      </div>
    </Paper>
  );
};

export default Sidebar;
