import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentLogin from './pages/AgentLogin';
import SupervisorLogin from './pages/SupervisorLogin';
import SupervisorDashboard from './pages/SupervisorDashbord';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AgentLogin />} />
        <Route path="/supervisor-login" element={<SupervisorLogin />} />
        <Route path="/supervisorDashboard/:id" element={<SupervisorDashboard />} />

      </Routes>
    </Router>
  );
};

export default App;
