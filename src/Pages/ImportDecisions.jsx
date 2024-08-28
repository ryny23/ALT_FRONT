import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const ImportDecisions = () => {
  const [csvData, setCsvData] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
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
          if (!row['Title'] || !row['Content']) {
            console.warn('Skipping empty row:', row);
            continue;
          }

          const payload = {
            title: row['Title'],
            content: row['Content'],
            status: 'publish',
            acf: {
              resume: row['Resume'],
              information: row['Information'],
            },
          };

          const response = row['ID']
            ? await axios.put(`https://alt.back.qilinsa.com/wp-json/wp/v2/decisions/${row['ID']}`, payload, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            : await axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions', payload, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

          console.log('Decision submitted/updated:', response.data);
        }

        alert('CSV import completed successfully.');
      } catch (error) {
        console.error('Error importing CSV data:', error);
        setError('Error during CSV import. Please try again.');
      }
    }
  };

  const handleCsvExport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
    }
  
    try {
      const response = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const decisions = response.data;
  
      const csvData = decisions.map((decision) => ({
        ID: decision.id,
        Title: decision.title.rendered,
        Content: decision.content.rendered.replace(/<\/?[^>]+(>|$)/g, ""), // Ensure we handle null or undefined content
        Resume: decision.acf?.resume || '',
        Information: decision.acf?.information || '',
        'Last Modified': decision.modified,
      }));
  
      const csv = Papa.unparse(csvData);
  
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'decisions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setError('Error during CSV export. Please try again.');
    }
  };
  

  return (
    <div>
      <section className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text px-10 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold">Importer et Exporter des Décisions via CSV</h2>

          <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-4" />
          <button
            onClick={handleCsvImport}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-gray-600"
          >
            Importer CSV
          </button>

          <button
            onClick={handleCsvExport}
            className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-gray-600"
          >
            Exporter CSV
          </button>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </section>
    </div>
  );
};

export default ImportDecisions;
