import React, { useState, useEffect } from "react";
import { Paper, Typography, Grid, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [emailsToProcess, setEmailsToProcess] = useState(0);
  const [emailsClosed, setEmailsClosed] = useState(0);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042"];

  // Données statiques pour la performance hebdomadaire
  const performanceData = [
    { day: "Lundi", processed: 10 },
    { day: "Mardi", processed: 12 },
    { day: "Mercredi", processed: 8 },
    { day: "Jeudi", processed: 15 },
    { day: "Vendredi", processed: 5 },
    { day: "Samedi", processed: 7 },
    { day: "Dimanche", processed: 6 },
  ];

  useEffect(() => {
    const fetchEmailData = async () => {
      setLoading(true);
      const instanceUrl = "https://nacer-dev-ed.develop.my.salesforce.com";
      const accessToken =
        "00Dd2000005q8pp!AQEAQHxIPaUJ3jRhIWRUTSp4Ua0bDwfOyytLF9hR0IDWzzhMcEEdpAgJs3pv57XHZXrQbf6hfpZhKC7MF.S4n9jPIy_rtQt5";

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

      try {
        // Query for all emails assigned to the agent
        const assignedEmailsQuery = `SELECT COUNT(Id) FROM Email_db__c WHERE Agent_dashbord__c = '${agentId}'`;
        const assignedEmailsResponse = await axios.get(
          `${instanceUrl}/services/data/v55.0/query`,
          {
            params: { q: assignedEmailsQuery },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Query for emails with "Close" status assigned to the agent
        const closedEmailsQuery = `SELECT COUNT(Id) FROM Email_db__c WHERE Agent_dashbord__c = '${agentId}' AND Status__c = 'Close'`;
        const closedEmailsResponse = await axios.get(
          `${instanceUrl}/services/data/v55.0/query`,
          {
            params: { q: closedEmailsQuery },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Query for status distribution
        const statusDistributionQuery = `SELECT Status__c, COUNT(Id) FROM Email_db__c WHERE Agent_dashbord__c = '${agentId}' GROUP BY Status__c`;
        const statusDistributionResponse = await axios.get(
          `${instanceUrl}/services/data/v55.0/query`,
          {
            params: { q: statusDistributionQuery },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Transform the distribution data
        const distributionData = statusDistributionResponse.data.records.map((record) => ({
          name: record.Status__c,
          value: record.expr0,
        }));

        // Update the state
        setEmailsToProcess(assignedEmailsResponse.data.records[0].expr0 || 0);
        setEmailsClosed(closedEmailsResponse.data.records[0].expr0 || 0);
        setStatusDistribution(distributionData);
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err.message);
        setError("Impossible de charger les données des emails.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmailData();
  }, []);

  if (loading) {
    return <Typography>Chargement du tableau de bord...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper style={{ padding: "2rem", margin: "1rem" }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>

      <Grid container spacing={3}>
        {/* Vue d'ensemble des emails */}
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: "1rem" }}>
            <Typography variant="h6">Emails Assignés</Typography>
            <Typography variant="body1">
              Emails à traiter : <strong>{emailsToProcess}</strong>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/dashboard/:id/emails-assignes"
              style={{ marginTop: "1rem" }}
            >
              Voir les emails
            </Button>
          </Paper>
        </Grid>

        {/* Historique des emails */}
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: "1rem" }}>
            <Typography variant="h6">Historique des Emails</Typography>
            <Typography variant="body1">
              Emails terminés : <strong>{emailsClosed}</strong>
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/dashboard/:id/historique"
              style={{ marginTop: "1rem" }}
            >
              Voir l'historique
            </Button>
          </Paper>
        </Grid>

        {/* Répartition des statuts et Performance hebdomadaire */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper style={{ padding: "1rem" }}>
                <Typography variant="h6">Répartition des Statuts</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Typography align="center" variant="body2">
                  Répartition des emails par statut
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper style={{ padding: "1rem" }}>
                <Typography variant="h6">Performance Hebdomadaire</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="processed" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
                <Typography align="center" variant="body2">
                  Emails traités quotidiennement
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Dashboard;
