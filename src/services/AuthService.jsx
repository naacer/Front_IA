import axios from 'axios';

const SALESFORCE_API_URL = 'https://nacer-dev-ed.develop.my.salesforce.com';
const SALESFORCE_ACCESS_TOKEN = '00Dd2000005q8pp!AQEAQHxIPaUJ3jRhIWRUTSp4Ua0bDwfOyytLF9hR0IDWzzhMcEEdpAgJs3pv57XHZXrQbf6hfpZhKC7MF.S4n9jPIy_rtQt5';

export const login = async (credentials, tableName) => {
  try {
    // Interroger Salesforce pour vérifier l'email et le mot de passe
    const query = `SELECT Id, Name, Email__c, Specialit__c, Images__c FROM ${tableName} WHERE Email__c = '${credentials.email}' AND Password__c = '${credentials.password}'`;
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
