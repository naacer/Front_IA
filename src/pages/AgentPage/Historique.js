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

      const instanceUrl = "https://nationalschoolofappliedsci3-dev-ed.develop.my.salesforce.com";
      const accessToken =
        "00D8e000000Nlhu!ARMAQK8o2uJSZ4xxD0.Kh5JZ17VZ.o34pH2LzQmZxiVgqr4Uc2L3tXXMiJHNKb8im1deuolMkFLTy8LEjMD4Kr9pTzLU4lBT";

      try {
        const query = `SELECT Id,CaseNumber , Subject, Status, Classification_Score_c__c,Solution_Predicted__c,Agent_Assigned__c FROM Case WHERE Agent_Assigned__c ='${agentId}' AND Status = 'Escalated'`;

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
            caseNumber: email.CaseNumber,
            subject: email.Subject,
            performance: email.Classification_Score_c__c,
            solution: email.Solution_Predicted__c,
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
              <TableCell>Case Number</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Solution</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id}>
                <TableCell>{email.caseNumber}</TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>{email.performance}</TableCell>
                <TableCell>{email.solution}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Historique;
