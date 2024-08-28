import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const CommentaireImport = () => {
  const [csvData, setCsvData] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        // Log the parsed data
        console.log('Parsed CSV data:', result.data);
        setCsvData(result.data);
        alert('CSV file uploaded and parsed successfully.');
      },
      header: true,
    });
  };
  

  const handleCsvImport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
    }
  
    if (csvData) {
      try {
        for (const row of csvData) {
          // Skip empty rows
          if (!row['Title'] || !row['Content']) {
            console.warn('Skipping empty row:', row);
            continue;
          }
  
          const payload = {
            title: row['Title'],
            content: row['Content'],
            status: 'publish',
            acf: {
              url: row['URL'],
            },
          };
  
          console.log('Sending payload:', payload);
  
          const response = await axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires', payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          console.log('Commentaire submitted', response.data);
        }
  
        alert('CSV import completed successfully.');
      } catch (error) {
        console.error('Error importing CSV data:', error);
        setError('Erreur lors de l\'importation du CSV. Veuillez réessayer.');
      }
    }
  };
  
  

  return (
    <div>
      <section className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text px-10 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold">Importer des Commentaires via CSV</h2>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-4" />
          <button
            onClick={handleCsvImport}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-gray-600"
          >
            Importer CSV
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </section>
    </div>
  );
};

export default CommentaireImport;
