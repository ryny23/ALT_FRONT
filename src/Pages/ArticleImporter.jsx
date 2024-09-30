import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setMessage('Veuillez sélectionner un fichier CSV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/importdecisions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      setMessage('Fichier importé avec succès.');
    } catch (error) {
      setMessage('Erreur lors de l\'importation du fichier.');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Importer un fichier CSV</h2>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button 
        onClick={handleFileUpload}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg mx-2 shadow-md hover:bg-blue-600"
      >
        Importer
      </button>
      {message && (
        <div className={`mt-4 p-2 ${message.startsWith('Erreur') ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'} rounded`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
