import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button } from "@mui/material";
import "../Styles/AgentTable.css";
import AgentIcon from "../../assets/icon.svg";
import { useNavigate } from "react-router-dom";

const AgentTable = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [sortedBy, setSortedBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({ name: "", email: "", phone: "", experience: "", tasks: "" });

  useEffect(() => {
    const fetchAgents = async () => {
      const instanceUrl = "https://nacer-dev-ed.develop.my.salesforce.com";
      const accessToken = "00Dd2000005q8pp!AQEAQHxIPaUJ3jRhIWRUTSp4Ua0bDwfOyytLF9hR0IDWzzhMcEEdpAgJs3pv57XHZXrQbf6hfpZhKC7MF.S4n9jPIy_rtQt5";

      try {
        const response = await axios.get(
          `${instanceUrl}/services/data/v55.0/query?q=SELECT+Id,Name,Email__c,Phone__c,Experience__c,Tasks__c,Images__c+FROM+Agent_dashbord__c`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const transformedData = response.data.records.map((record) => ({
          id: record.Id,
          name: record.Name,
          email: record.Email__c,
          phone: record.Phone__c,
          experience: record.Experience__c,
          tasks: record.Tasks__c,
          image: record.Images__c, // Image URL
        }));

        setAgents(transformedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchAgents();
  }, []);

  const handleSort = (property) => {
    const isAsc = sortedBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortedBy(property);
  };

  const sortData = (array) => {
    return array.sort((a, b) => {
      if (a[sortedBy] < b[sortedBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortedBy] > b[sortedBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filteredAgents = agents.filter((agent) => {
    return (
      (agent.name?.toLowerCase() || "").includes(filters.name.toLowerCase()) &&
      (agent.email?.toLowerCase() || "").includes(filters.email.toLowerCase()) &&
      (agent.phone?.toLowerCase() || "").includes(filters.phone.toLowerCase()) &&
      (agent.experience?.toLowerCase() || "").includes(filters.experience.toLowerCase()) &&
      (agent.tasks?.toLowerCase() || "").includes(filters.tasks.toLowerCase())
    );
  });

  const sortedAgents = sortData(filteredAgents);

  const getExperienceClass = (experience) => {
    const normalizedExperience = experience.trim().toLowerCase(); // Supprime les espaces et passe en minuscule
    switch (normalizedExperience) {
      case "junior":
        return "experience-junior";
      case "midlevel":
        return "experience-midlevel";
      case "senior":
        return "experience-senior";
      default:
        return "";
    }
  };

  // Fonction pour obtenir l'ID de l'agent en utilisant son email
  const getAgentIdByEmail = (email) => {
    const agent = agents.find((agent) => agent.email === email);
    return agent ? agent.id : null; // Retourne l'ID de l'agent ou null si non trouvé
  };

  return (
    <div className="Card">
      <div className="agent-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={AgentIcon} alt="Agent Icon" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
          <h2>Agents</h2>
        </div>
        <TextField
          label="Filtrer par expérience"
          variant="outlined"
          size="small"
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          style={{ width: "200px", marginLeft: "10px", marginRight: "40px", borderRadius: "25px" }}
        />
      </div>

      <div className="Card-table">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Expérience</TableCell>
                <TableCell>Tâches</TableCell>
                <TableCell>Details</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={agent.image} alt={agent.name} className="table-image" />
                      <span>{agent.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.phone}</TableCell>
                  <TableCell>
                    <button className={`experience-button ${getExperienceClass(agent.experience)}`}>
                      {agent.experience.charAt(0).toUpperCase() + agent.experience.slice(1)}
                    </button>
                  </TableCell>
                  <TableCell>{agent.tasks}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        const agentId = getAgentIdByEmail(agent.email); // Récupérer l'ID de l'agent via son email
                        if (agentId) {
                          navigate(`/agent-details/${agentId}`); // Rediriger vers la page des détails de l'agent
                        }
                      }}
                    >
                      Show Details
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AgentTable;
