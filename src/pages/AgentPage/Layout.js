// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../AgentComponents/Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar fixe */}
      <Sidebar />

      {/* Contenu principal */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
