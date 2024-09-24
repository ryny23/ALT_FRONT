import React, { useState } from 'react';
import Papa from 'papaparse';

function CsvImporter() {
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

  // Fonction pour formater les dates en "YYYY-MM-DD"
  const formatDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (!isNaN(parsedDate)) {
      return parsedDate.toISOString().split('T')[0];
    } else {
      // Gestion des formats non standards comme "12-juin-67"
      const dateParts = date.split(/[-\/]/);
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2].length === 2 ? `19${dateParts[2]}` : dateParts[2];

      // Conversion des mois en français en format numérique
      const months = {
        'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04', 'mai': '05', 'juin': '06',
        'juillet': '07', 'août': '08', 'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
      };

      return `${year}${months[month.toLowerCase()]}${day}`;
    }
  };

  // Fonction pour faire les appels API avec authentification par token
  const processCsvData = async () => {
    setLoading(true);
    setMessage('');
    let lastLegislationId = null;
    let lastTitreId = null;
    let lastChapitreId = null;

    try {
      for (const row of csvData) {
        const { Titre_legislation, Titre, Chapitre, Section, Code_visé, Date_entrée, Date_modification, Article } = row;
        
        const formattedDateEntree = formatDate(Date_entrée);
        const formattedDateModification = formatDate(Date_modification);
        
        let response;
        if (!Titre && !Chapitre && !Section && !Article) {
          // Crée une législation
          response = await fetch('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: Titre_legislation, 
              acf:{
                code: Code_visé,
                date_entree: formattedDateEntree,
                date_modif: formattedDateModification,
              },
              status: 'publish',
            })
          });

          if (response.ok) {
            const data = await response.json();
            lastLegislationId = data.id; // Récupère l'ID de la législation
            lastTitreId = null; // Réinitialise l'ID du titre lorsque la législation change
            lastChapitreId = null; // Réinitialise l'ID du chapitre lorsque la législation change
            console.log('Législation créée:', Titre_legislation, 'ID:', lastLegislationId);
          } else {
            const errorData = await response.json();
            throw new Error(`Erreur lors de la création de la législation: ${errorData.message}`);
          }

        } else if (!Chapitre && !Section && !Article) {
          // Crée un titre avec l'ID de la législation dans ACF
          response = await fetch('https://alt.back.qilinsa.com/wp-json/wp/v2/titres', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: Titre, 
              status: 'publish',
              acf: {
                legislation: lastLegislationId // Mappe l'ID de la législation dans ACF
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            lastTitreId = data.id; // Récupère l'ID du titre
            console.log('Titre créé:', Titre, 'avec ID de législation:', lastLegislationId);
          } else {
            const errorData = await response.json();
            throw new Error(`Erreur lors de la création du titre: ${errorData.message}`);
          }

        } else if (!Section && !Article) {
          // Crée un chapitre avec l'ID du titre ou de la législation dans ACF
          const legislationOuTitreId = lastTitreId ? lastTitreId : lastLegislationId;

          response = await fetch('https://alt.back.qilinsa.com/wp-json/wp/v2/chapitres', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: Chapitre, 
              status: 'publish',
              acf: {
                legislation_ou_titre: legislationOuTitreId, // Mappe l'ID du titre ou de la législation
                legislation: lastLegislationId
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            lastChapitreId = data.id; // Récupère l'ID du chapitre
            console.log('Chapitre créé:', Chapitre, 'avec ID de titre ou législation:', legislationOuTitreId);
          } else {
            const errorData = await response.json();
            throw new Error(`Erreur lors de la création du chapitre: ${errorData.message}`);
          }

        } else if (!Article){
          // Crée une section avec l'ID du chapitre, du titre ou de la législation dans ACF
          const legislationOuTitreOuChapitreId = lastChapitreId ? lastChapitreId : (lastTitreId ? lastTitreId : lastLegislationId);

          response = await fetch('https://alt.back.qilinsa.com/wp-json/wp/v2/sections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: Section, 
              status: 'publish',
              acf: {
                legislation_ou_titre_ou_chapitre: legislationOuTitreOuChapitreId, // Mappe l'ID du chapitre, du titre ou de la législation
                legislation: lastLegislationId
              }
            })
          });

          if (response.ok) {
            console.log('Section créée:', Section, 'avec ID de chapitre, titre ou législation:', legislationOuTitreOuChapitreId);
          } else {
            const errorData = await response.json();
            throw new Error(`Erreur lors de la création de la section: ${errorData.message}`);
          }
        } else {
          // Récupère l'article avec son identifiant et fait le mapping avec la législation
          response = await fetch(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles/${Article}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const articleData = await response.json();

            // Faire le mapping de l'article avec la législation
            response = await fetch(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles/${Article}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                acf: {
                  Legislation_ou_titre_ou_chapitre_ou_section: lastLegislationId // Mappe l'ID de la législation à l'article
                }
              })
            });

            if (response.ok) {
              console.log('Article mis à jour avec succès:', articleData.title.rendered, 'avec ID de législation:', lastLegislationId);
            } else {
              const errorData = await response.json();
              throw new Error(`Erreur lors du mapping de l'article: ${errorData.message}`);
            }
          } else {
            const errorData = await response.json();
            throw new Error(`Erreur lors de la récupération de l'article: ${errorData.message}`);
          }
        }
      }
      setMessage('Importation réussie !');
    } catch (error) {
      setMessage(`Erreur lors de l'importation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Importer un fichier CSV pour législation</h2>
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

export default CsvImporter;
