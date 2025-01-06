import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import './AgentDetails.css';

const AgentDetails = () => {
  const { id } = useParams(); // Récupère l'ID de l'agent depuis l'URL
  const [agentDetails, setAgentDetails] = useState(null);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      const instanceUrl = "https://nacer-dev-ed.develop.my.salesforce.com";
      const accessToken = "00Dd2000005q8pp!AQEAQHxIPaUJ3jRhIWRUTSp4Ua0bDwfOyytLF9hR0IDWzzhMcEEdpAgJs3pv57XHZXrQbf6hfpZhKC7MF.S4n9jPIy_rtQt5";

      try {
        // Récupère les détails de l'agent
        const agentResponse = await axios.get(
          `${instanceUrl}/services/data/v55.0/sobjects/Agent_dashbord__c/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAgentDetails(agentResponse.data);

        // Récupère les emails associés à l'agent
        const emailsResponse = await axios.get(
          `${instanceUrl}/services/data/v55.0/query?q=SELECT Id, Object__c, Content__c, Status__c, Agent_dashbord__c FROM Email_db__c WHERE Agent_dashbord__c ='${id}'`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setEmails(emailsResponse.data.records);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'agent ou des emails :", error);
      }
    };

    fetchAgentDetails();
  }, [id]);

  if (!agentDetails) {
    return <p>Loading...</p>;
  }

  return (
    <Paper className="paper-container">
      {/* Section Image et Nom */}
      <div className="agent-header">
        <img
          src={agentDetails.Images__c || 'https://via.placeholder.com/150'}
          alt="Agent"
        />
        <h2>{agentDetails.Name}</h2>
      </div>

      {/* Titre et Table des informations de l'agent */}
      <h3 className="table-title">Informations de l'Agent</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Task</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{agentDetails.Email__c}</td>
              <td>{agentDetails.Phone__c}</td>
              <td>{agentDetails.Experience__c}</td>
              <td>{agentDetails.Tasks__c}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Espacement entre les deux tables */}
      <div className="spacer"></div>

      {/* Titre et Table des emails associés */}
      <h3 className="table-title">Emails Associés</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Object</th>
              <th>Content</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email, index) => (
              <tr key={index}>
                <td>{email.Object__c}</td>
                <td>{email.Content__c}</td>
                <td>{email.Status__c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={() => window.history.back()}>Back</Button>
    </Paper>
  );
};

export default AgentDetails;
