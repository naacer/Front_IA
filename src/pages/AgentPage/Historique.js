import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const Historique = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const agentData = localStorage.getItem("Agent");
      if (!agentData) {
        setError("Agent introuvable dans le localStorage !");
        setLoading(false);
        return;
      }

      const agentId = JSON.parse(agentData)?.Id;
      if (!agentId) {
        setError("ID de l'agent introuvable !");
        setLoading(false);
        return;
      }

      const instanceUrl = "https://nacer-dev-ed.develop.my.salesforce.com";
      const accessToken =
        "00Dd2000005q8pp!AQEAQDRTw3dG5.OLEDQjrWrKTvR2o_newvlHxAyZjP5lpC5CGEpD69WjCFjP7NLuZuOg5UCQJiMg7A1l6uChgTRZrMT4FBXi";

      try {
        const query = `SELECT Id, Object__c, Content__c, Status__c, Agent_dashbord__c FROM Email_db__c WHERE Agent_dashbord__c = '${agentId}' AND Status__c = 'Close'`;

        const response = await axios.get(
          `${instanceUrl}/services/data/v55.0/query`,
          {
            params: { q: query },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const transformedEmails = response.data.records.map((email) => ({
          id: email.Id,
          object: email.Object__c,
          content: email.Content__c,
          status: email.Status__c,
        }));

        setEmails(transformedEmails);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des emails :",
          err.response ? err.response.data : err.message
        );
        setError("Impossible de charger les emails.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading) return <Typography>Chargement des emails...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Paper style={{ margin: "1rem", padding: "1rem" }}>
      <Typography variant="h5" style={{ marginBottom: "1rem" }}>
        Historique des Emails 
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Objet</TableCell>
              <TableCell>Contenu</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id}>
                <TableCell>{email.object}</TableCell>
                <TableCell>{email.content}</TableCell>
                <TableCell>{email.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Historique;
