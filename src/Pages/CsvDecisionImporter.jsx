import React, { useState } from 'react';
import Papa from 'papaparse';

function CsvDecisionImporter() {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token'); 

  // Fonction pour lire et traiter le fichier CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      skipEmptyLines: true,
    });
  };

  // Fonction pour traiter les données CSV et créer des décisions
  const processCsvData = async () => {
    setLoading(true);
    setMessage('');
  
    try {
      for (const row of csvData) {
        // Affichez la ligne pour inspecter les données brutes
        console.log('Données CSV brutes:', row);
  
        // Vérification des données CSV avant traitement
        const { Title, ID_articles, ID_legislation, ID_commentaires, Resume, Information } = row;
  
        // Vérifiez les valeurs avant le split
        console.log('ID_articles avant split:', ID_articles);
        console.log('ID_commentaires avant split:', ID_commentaires);
        console.log('ID_legislation avant split:', ID_legislation);
  
        // Transforme les chaînes d'identifiants en tableaux d'entiers
        const articleIds = ID_articles ? ID_articles.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
        const legislationIds = ID_legislation ? ID_legislation.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
        const commentaireIds = ID_commentaires ? ID_commentaires.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
  
        // Vérifiez les tableaux après le split
        console.log('articleIds après split:', articleIds);
        console.log('commentaireIds après split:', commentaireIds);
        console.log('legislationIds après split:', legislationIds);
  
        // Crée une décision avec les champs mappés à ACF
        const response = await fetch('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: Title,
            status: 'publish',
            acf: {
              article: articleIds.length > 0 ? articleIds : undefined,
              legislation: legislationIds.length > 0 ? legislationIds : undefined,
              commentaire: commentaireIds.length > 0 ? commentaireIds : undefined,
              resume: Resume,
              information: Information
            }
          })
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Décision créée:', Title, 'ID:', data.id);
        } else {
          const errorData = await response.json();
          console.error('Erreur lors de la création de la décision:', errorData);
          throw new Error(`Erreur lors de la création de la décision: ${errorData.message}`);
        }
      }
      setMessage('Importation des décisions réussie !');
    } catch (error) {
      setMessage(`Erreur lors de l'importation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  


  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Importer un fichier CSV pour décisions</h2>
      <input
        className="mb-4 p-2 border border-gray-300 rounded"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg mx-2 shadow-md hover:bg-blue-600"
        onClick={processCsvData}
        disabled={loading}
      >
        {loading ? 'Importation en cours...' : 'Importer'}
      </button>
      {message && (
        <div className={`mt-4 p-2 ${message.startsWith('Erreur') ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'} rounded`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default CsvDecisionImporter;
