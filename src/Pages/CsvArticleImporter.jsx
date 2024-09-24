import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function CsvArticleImporter() {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

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

  const processCsvData = async () => {
    setLoading(true);
    setMessage('');

    try {
      for (const row of csvData) {
        const { Title, Content, Excerpt, ID_legislation, Position_legislation, ID_commentaire, ID_decision } = row;

        const legislationIds = ID_legislation ? ID_legislation.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
        const commentaireIds = ID_commentaire ? ID_commentaire.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
        const decisionIds = ID_decision ? ID_decision.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];

        const articleData = {
          title: Title,
          status: 'publish',
          content: Content,
          excerpt: Excerpt,
          acf: {
            // Legislation_ou_titre_ou_chapitre_ou_section: legislationIds.length > 0 ? legislationIds : undefined,
            commentaire: commentaireIds.length > 0 ? commentaireIds : undefined,
            decision: decisionIds.length > 0 ? decisionIds : undefined,
          }
        };

        // Post the article to WordPress
        const response = await axios.post(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles`, articleData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const newArticleID = response.data.id;

        if (legislationIds.length > 0) {
          const legislationId = legislationIds[0];

          // Récupérer les éléments de législation
          const legislationResponse = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${legislationId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          // Récupérer la liste existante d'articles
          let legislationItems = Array.isArray(legislationResponse.data.acf.titre_ou_chapitre_ou_section_ou_articles) 
            ? legislationResponse.data.acf.titre_ou_chapitre_ou_section_ou_articles 
            : [];

          // Ajouter l'article à la position spécifiée
          const position = parseInt(Position_legislation, 10) - 1; // Convertir la position en index (0-based)

          // Ajouter l'article à la bonne position en décalant les autres articles
          legislationItems.splice(position, 0, newArticleID);

          // Mettre à jour la législation avec la nouvelle liste d'articles
          await axios.post(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${legislationId}`, {
            acf: {
              titre_ou_chapitre_ou_section_ou_articles: legislationItems
            }
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          console.log('Article ajouté à la position spécifiée et législation mise à jour.');
        }
      }

      setMessage('Importation des articles réussie !');
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error.response?.data || error.message);
      setMessage(`Erreur lors de l'importation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Importer un fichier CSV pour articles</h2>
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

export default CsvArticleImporter;
