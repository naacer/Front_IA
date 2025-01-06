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
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const statusOptions = ["New", "Working", "Escalated"]; // Options de statut disponibles

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
        const query = `SELECT Id,CaseNumber , Subject, Status, Classification_Score_c__c,Solution_Predicted__c,Agent_Assigned__c FROM Case WHERE Agent_Assigned__c ='${agentId}'`;

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
          status: email.Status,
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

  const openDialog = (email) => {
    setSelectedEmail(email);
    setNewStatus(email.status); // Valeur par défaut
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedEmail(null);
    setNewStatus("");
  };

  const updateEmailStatus = async () => {
    if (!selectedEmail || !newStatus) return;

    const instanceUrl = "https://nationalschoolofappliedsci3-dev-ed.develop.my.salesforce.com";
    const accessToken =
      "00D8e000000Nlhu!ARMAQK8o2uJSZ4xxD0.Kh5JZ17VZ.o34pH2LzQmZxiVgqr4Uc2L3tXXMiJHNKb8im1deuolMkFLTy8LEjMD4Kr9pTzLU4lBT";

    try {
      await axios.patch(
        `${instanceUrl}/services/data/v55.0/sobjects/Case/${selectedEmail.id}`,
        { Status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Mise à jour locale
      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email.id === selectedEmail.id
            ? { ...email, status: newStatus }
            : email
        )
      );

      closeDialog(); // Ferme la boîte de dialogue après la mise à jour
    } catch (err) {
      console.error(
        "Erreur lors de la mise à jour du statut :",
        err.response ? err.response.data : err.message
      );
      alert("Impossible de mettre à jour le statut dans Salesforce.");
    }
  };

  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "Escalated":
        return { backgroundColor: "#4CAF50", color: "#fff" }; // Vert
      case "Working":
        return { backgroundColor: "#2196F3", color: "#fff" }; // Bleu
      case "New":
        return { backgroundColor: "#F44336", color: "#fff" }; // Rouge
      default:
        return { backgroundColor: "#9E9E9E", color: "#fff" }; // Gris par défaut
    }
  };

  if (loading) return <Typography>Chargement des emails...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Paper style={{ margin: "1rem", padding: "1rem" }}>
      <Typography variant="h5" style={{ marginBottom: "1rem" }}>
        Emails Assignés
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CaseNumber</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Solution</TableCell>                         
              <TableCell>Statut</TableCell>             
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id}>
                <TableCell>{email.caseNumber}</TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>{email.performance}</TableCell>
                <TableCell>{email.solution}</TableCell>
                <TableCell>
                  <Button
                    style={{
                      ...getStatusButtonStyle(email.status),
                      borderRadius: "5px",
                      padding: "5px 10px",
                      fontWeight: "bold",
                    }}
                    disabled
                  >
                    {email.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openDialog(email)}
                  >
                    Changer statut
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Boîte de dialogue pour choisir un nouveau statut */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Changer le statut</DialogTitle>
        <DialogContent>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Annuler
          </Button>
          <Button onClick={updateEmailStatus} color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmailList;
