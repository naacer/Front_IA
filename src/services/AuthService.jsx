import axios from 'axios';

const SALESFORCE_API_URL = 'https://nationalschoolofappliedsci3-dev-ed.develop.my.salesforce.com';
const SALESFORCE_ACCESS_TOKEN = '00D8e000000Nlhu!ARMAQL9rVTwCRB1OBVm5fAvBkjh7o1IqcUwW8qTrXL3TNo9uxp9rx.eNppUNe1wVIvJ3qo.3cXzuJpGFt8yddqfWEhUug_.O';

export const login = async (credentials, tableName) => {
  try {
    // Interroger Salesforce pour vérifier l'email et le mot de passe
    const query = `SELECT Id, Name, Email_c__c, image__c FROM ${tableName} WHERE Email_c__c = '${credentials.email}' AND password__c = '${credentials.password}'`;
    const response = await axios.get(
      `${SALESFORCE_API_URL}/services/data/v57.0/query`,
      {
        headers: {
          Authorization: `Bearer ${SALESFORCE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        params: { q: query },
      }
    );

    // Vérifiez si un enregistrement correspondant est trouvé
    if (response.data.records.length > 0) {
      return response.data.records[0]; // Retourne l'objet trouvé
    } else {
      throw new Error('Email or password incorrect');
    }
  } catch (error) {
    console.error('Salesforce query failed:', error);
    throw error;
  }
};
