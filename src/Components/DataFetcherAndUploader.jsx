import React, { useState } from 'react';
import Papa from 'papaparse';

const JsonToCsv = () => {
  const [csvData, setCsvData] = useState(null);

  // Fonction pour traiter le fichier JSON uploadé
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;

        // Essayer de parser le JSON et gérer les erreurs
        try {
          const json = JSON.parse(fileContent);
          console.log("JSON parsed successfully:", json); // Log pour vérifier le JSON
          convertToCsv(json); // Convertir le JSON en CSV
        } catch (error) {
          console.error('Error parsing JSON, but continuing:', error);

          // Ignorer le parsing incorrect et continuer avec un objet par défaut ou des valeurs
          const fallbackData = {
            input: "Invalid input",
            result: "Invalid result due to parsing error"
          };
          convertToCsv(fallbackData); // Convertir des données par défaut
        }
      };
      reader.readAsText(file); // Lire le fichier comme texte
    }
  };

  // Fonction pour convertir JSON en CSV
  const convertToCsv = (data) => {
    if (data && typeof data === 'object') {
      const dataToConvert = Array.isArray(data) ? data : [data]; // S'assurer que c'est un tableau
      const csv = Papa.unparse(dataToConvert);
      setCsvData(csv);
    } else {
      console.error('Invalid data structure. Expected an object or an array of objects.');
    }
  };

  // Fonction pour télécharger le fichier CSV
  const downloadCsv = () => {
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv'); // nom du fichier
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h1>Convertisseur JSON en CSV</h1>
      <input
        type="file"
        accept=".json" // N'accepte que les fichiers JSON
        onChange={handleFileChange}
      />
      {csvData && (
        <button onClick={downloadCsv}>Télécharger le CSV</button>
      )}
    </div>
  );
};

export default JsonToCsv;
