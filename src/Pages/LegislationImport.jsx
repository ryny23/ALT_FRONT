import React, { useState } from 'react';
import Papa from 'papaparse';

function CsvImporter() {
  const [csvData, setCsvData] = useState([]);
  const token = localStorage.getItem('token'); // Remplacez par votre vrai token

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

  // Fonction pour faire les appels API avec authentification par token
  const processCsvData = async () => {
    let lastLegislationId = null;
    let lastTitreId = null;
    let lastChapitreId = null;
  
    for (const row of csvData) {
      const { Titre_legislation, Titre, Chapitre, Section } = row;
      let response;
      try {
        if (!Titre && !Chapitre && !Section) {
          // Crée une législation
          response = await fetch('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: Titre_legislation, 
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
            console.error('Erreur lors de la création de la législation:', errorData);
          }
  
        } else if (!Chapitre && !Section) {
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
            console.error('Erreur lors de la création du titre:', errorData);
          }
  
        } else if (!Section) {
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
            console.error('Erreur lors de la création du chapitre:', errorData);
          }
  
        } else {
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
            console.error('Erreur lors de la création de la section:', errorData);
          }
        }
      } catch (error) {
        console.error('Erreur lors du traitement des données:', error);
      }
    }
  };
  
  
  
  

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Importer un fichier CSV pour legislation</h2>
      <input  className="mb-4 p-2 border border-gray-300 rounded" type="file" accept=".csv" onChange={handleFileUpload} />
      <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600" onClick={processCsvData}>Importer</button>
    </div>
  );
}

export default CsvImporter;
