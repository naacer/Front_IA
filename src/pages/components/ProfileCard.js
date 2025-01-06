import React, { useEffect, useState } from "react";
import "../Styles/ProfileCard.css";

const ProfileCard = () => {
  const [supervisor, setSupervisor] = useState(null);

  useEffect(() => {
    // Récupérer les informations du superviseur depuis le localStorage
    const storedSupervisor = localStorage.getItem("supervisor");
    if (storedSupervisor) {
      setSupervisor(JSON.parse(storedSupervisor));
    }
  }, []);

  if (!supervisor) {
    return <p>Loading profile...</p>; // Affichage pendant le chargement
  }

  return (
    <div className="profile-card">
      <h3>{supervisor.Name}</h3>
      <p>Email: {supervisor.Email_c__c}</p>
      <p>Role: Supervisor</p>
      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("supervisor"); // Supprimer les données au logout
          window.location.href = "/"; // Rediriger vers la page de login
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileCard;
