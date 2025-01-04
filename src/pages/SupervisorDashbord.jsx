import React, { useEffect, useState } from "react";
import Navbar from "../pages/components/Navbar";
import WelcomeHeader from "../pages/components/WelcomeHeader";
import AgentTable from "../pages/components/AgentTable";
import "./SupervisorDashbord.css";

function SupervisorDashbord() {
  const [supervisorName, setSupervisorName] = useState("");

  useEffect(() => {
    // Récupérer les informations du superviseur depuis le localStorage
    const storedSupervisor = localStorage.getItem("supervisor");
    if (storedSupervisor) {
      const supervisor = JSON.parse(storedSupervisor);
      setSupervisorName(supervisor.Name || "Unknown");
    }
  }, []);

  return (
    <div className="app-container">
      <Navbar supervisorName={supervisorName} />
      <WelcomeHeader supervisorName={supervisorName} />
      <AgentTable />
    </div>
  );
}

export default SupervisorDashbord;
