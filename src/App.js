import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentLogin from './pages/AgentLogin';
import SupervisorLogin from './pages/SupervisorLogin';
import SupervisorDashboard from './pages/SupervisorDashbord';
import EmailList from './pages/AgentComponents/EmailList';
import Historique from './pages/AgentPage/Historique';
import Dashboard from './pages/AgentPage/Dashboard';
import Layout from './pages/AgentPage/Layout';
import AgentDetails from './pages/components/AgentDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Pages sans sidebar */}
        <Route path="/" element={<AgentLogin />} />
        <Route path="/supervisor-login" element={<SupervisorLogin />} />
        <Route path="/supervisorDashboard/:id" element={<SupervisorDashboard />} />
        <Route path="/agent-details/:id" element={<AgentDetails />} />

        {/* Pages avec sidebar */}
        <Route path="/dashboard/:id" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="historique" element={<Historique />} />
          <Route path="emails-assignes" element={<EmailList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
