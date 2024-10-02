import React, { useState } from 'react';

const JsonlToCsvConverter = () => {
  const [csvContent, setCsvContent] = useState('');

  // Gestion de la sélection de fichier JSONL
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonlData = e.target.result.split('\n').filter(Boolean); // Split by lines, ignoring empty lines
        const jsonData = jsonlData.map(line => JSON.parse(line)); // Parse each line as JSON
        convertToCsv(jsonData);
      };
      reader.readAsText(file);
    }
  };

  // Conversion JSON vers CSV sans dépendance
  const convertToCsv = (jsonData) => {
    if (jsonData.length === 0) return;

    // Extraire les en-têtes (clés du premier objet)
    const headers = Object.keys(jsonData[0]);

    // Générer les lignes CSV
    const csvRows = [
      headers.join(','), // Ligne des en-têtes
      ...jsonData.map(row => headers.map(field => JSON.stringify(row[field], replacer)).join(',')) // Lignes des données
    ];

    setCsvContent(csvRows.join('\n'));
  };

  // Échapper les caractères spéciaux pour CSV
  const replacer = (key, value) => {
    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      return `"${value.replace(/"/g, '""')}"`; // Double quotes pour échapper les valeurs contenant des virgules, guillemets ou nouvelles lignes
    }
    return value;
  };

  // Téléchargement du fichier CSV
  const downloadCsv = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'converted_file.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Convertisseur JSONL en CSV</h2>
      <input type="file" accept=".jsonl" onChange={handleFileChange} />
      {csvContent && (
        <>
          <button onClick={downloadCsv}>Télécharger le fichier CSV</button>
          <pre>{csvContent}</pre>
        </>
      )}
    </div>
  );
};

export default JsonlToCsvConverter;
