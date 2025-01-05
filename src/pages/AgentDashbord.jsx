import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./AgentPage/Dashboard"
const AgentDashbord = () => (
  <div style={{ fontFamily: "'Roboto', sans-serif", color: '#333' }}>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  </div>
);

export default AgentDashbord;
