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
            const instanceUrl = "https://nationalschoolofappliedsci3-dev-ed.develop.my.salesforce.com";
            const accessToken = "00D8e000000Nlhu!ARMAQA_Z8ysj4DltN_GuIgnscGHDzTfQ6l0Uu30Omj3feok8aSWeHBhFQdMKsYDziwPMET6755nfEwlLnTnCkboZw4gTeOUq";

            try {
                // Récupère les détails de l'agent
                const agentResponse = await axios.get(
                    `${instanceUrl}/services/data/v55.0/sobjects/Agent_c__c/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setAgentDetails(agentResponse.data);

                // Récupère les emails associés à l'agent
                const emailsResponse = await axios.get(
                    `${instanceUrl}/services/data/v55.0/query?q=SELECT Id,CaseNumber , Subject, Status, Classification_Score_c__c,Solution_Predicted__c,Agent_Assigned__c FROM Case WHERE Agent_Assigned__c ='${id}'`,
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
                    src={agentDetails.image__c || 'https://via.placeholder.com/150'}
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
                            <th>experience</th>
                            <th>Performance</th>
                            <th>Skills</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{agentDetails.Email_c__c}</td>
                            <td>{agentDetails.Experience_Level__c}</td>
                            <td>{agentDetails.Performance_Score__c}</td>
                            <td>
                                {agentDetails.Skills__c.split(";").map((skill, index) => (
                                    <div key={index}>{skill.trim()}</div>
                                ))}
                            </td>            </tr>
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
                            <th>Case Number</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Classification score</th>
                            <th>Solution</th>

                        </tr>
                    </thead>
                    <tbody>
                        {emails.map((email, index) => (
                            <tr key={index}>
                                <td>{email.CaseNumber}</td>
                                <td>{email.Subject}</td>
                                <td>{email.Status}</td>
                                <td>{email.Classification_Score_c__c}</td>
                                <td>{email.Solution_Predicted__c}</td>
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
