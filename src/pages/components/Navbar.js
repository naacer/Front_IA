import React, { useState } from "react";
import "../Styles/Navbar.css";
import { InputBase, IconButton, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProfileCard from "./ProfileCard.js";
import { blue } from '@mui/material/colors';

const Navbar = ({ supervisorName }) => {
  const [showProfileCard, setShowProfileCard] = useState(false);

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
            src="https://cdn.worldvectorlogo.com/logos/salesforce-2.svg"         
            alt="Salesforce Logo"
          className="salesforce-logo"
        />
        <span className="supervisor-name">Agent Management</span>
      </div>
      <div className="search-bar">
          <SearchIcon />
          <InputBase placeholder="Search..." />
        </div>
      <div className="navbar-right">
      <div className="profile-icon" onClick={toggleProfileCard}>
      <IconButton>
<Avatar sx={{ bgcolor: blue[500] }}>{supervisorName.charAt(0)}</Avatar>
 
</IconButton>

      </div>
      </div>
      {showProfileCard && <ProfileCard />}
    </nav>
  );
};

export default Navbar;
