import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Button, Checkbox } from "@mui/material";
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
      const instanceUrl = "https://nationalschoolofappliedsci3-dev-ed.develop.my.salesforce.com";
      const accessToken = "00D8e000000Nlhu!ARMAQL9rVTwCRB1OBVm5fAvBkjh7o1IqcUwW8qTrXL3TNo9uxp9rx.eNppUNe1wVIvJ3qo.3cXzuJpGFt8yddqfWEhUug_.O";

      try {
        const response = await axios.get(
          `${instanceUrl}/services/data/v55.0/query?q=SELECT+Id,Name,Email_c__c,Experience_Level__c,Available__c,image__c,Performance_Score__c,Skills__c+FROM+Agent_c__c`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const transformedData = response.data.records.map((record) => ({
          id: record.Id,
          name: record.Name,
          email: record.Email_c__c,
          experience: record.Experience_Level__c,
          skills: record.Skills__c,
          image: record.image__c,
          available: record.Available__c,
          performance: record.Performance_Score__c
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
    const normalizedExperience = experience.trim().toLowerCase();
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

  const getAgentIdByEmail = (email) => {
    const agent = agents.find((agent) => agent.email === email);
    return agent ? agent.id : null;
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
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Expérience</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Available</TableCell>
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
                  <TableCell>
                    <button className={`experience-button ${getExperienceClass(agent.experience)}`}>
                      {agent.experience.charAt(0).toUpperCase() + agent.experience.slice(1)}
                    </button>
                  </TableCell>
                  <TableCell>
                    {agent.skills.split(";").map((skill, index) => (
                      <div key={index}>{skill.trim()}</div>
                    ))}
                  </TableCell>


                  <TableCell>{agent.performance}</TableCell>
                  <TableCell>
                    <Checkbox checked={agent.available} disabled />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        const agentId = getAgentIdByEmail(agent.email);
                        if (agentId) {
                          navigate(`/agent-details/${agentId}`);
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
