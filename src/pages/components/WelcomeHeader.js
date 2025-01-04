import React from "react";
import "../Styles/WelcomeHeader.css";

const WelcomeHeader = ({ supervisorName }) => {
  return (
    <header className="welcome-header">
      <h1>Welcome back, {supervisorName}</h1>
    </header>
  );
};

export default WelcomeHeader;
