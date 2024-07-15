import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost/wp-json/wp/v2/search?search=${searchTerm}&subtype=legislation,article`);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to search:', error);
      setResults([]);
    }
  };

  const fetchLegislationId = async (articleId) => {
    try {
      const articleResponse = await axios.get(`http://localhost/wp-json/wp/v2/articles/${articleId}`);
      const articleData = articleResponse.data;
  
      // Extraire l'ID de la section depuis articleData.acf.section
      const sectionId = articleData.acf.section ? Object.values(articleData.acf.section)[0] : null;
      if (!sectionId) throw new Error('Section ID not found');
  
      // Récupérer les détails de la section en utilisant l'ID de la section
      const sectionResponse = await axios.get(`http://localhost/wp-json/wp/v2/sections/${sectionId}`);
      const sectionData = sectionResponse.data;
  
      // Extraire l'ID du chapitre depuis sectionData.acf.chapitre
      const chapterId = sectionData.acf.chapitre ? sectionData.acf.chapitre : null;
      if (!chapterId) throw new Error('Chapter ID not found');
  
      // Récupérer les détails du chapitre en utilisant l'ID du chapitre
      const chapterResponse = await axios.get(sectionData._links['acf:post'][0].href); // Utilisation du premier lien pour chapitre
      const chapterData = chapterResponse.data;
  
      // Extraire l'ID du titre depuis chapterData.acf.titre
      const titreId = chapterData.acf.titre ? chapterData.acf.titre : null;
      if (!titreId) throw new Error('Titre ID not found');
  
      // Récupérer les détails du titre en utilisant l'ID du titre
      const titreResponse = await axios.get(chapterData._links['acf:post'][0].href); // Utilisation du premier lien pour titre
      const titreData = titreResponse.data;
  
      // Extraire l'ID de la législation depuis titreData.acf.legislation
      const legislationId = titreData.acf.legislation ? titreData.acf.legislation : null;
      if (!legislationId) throw new Error('Legislation ID not found');
  
      // Récupérer les détails de la législation en utilisant l'ID de la législation
      const legislationResponse = await axios.get(titreData._links['acf:post'][0].href); // Utilisation du premier lien pour législation
      const legislationData = legislationResponse.data;
  
      return legislationData.id;
    } catch (error) {
      console.error('Failed to fetch legislation ID:', error);
      throw error;
    }
  };
  

  const handleArticleClick = async (articleId) => {
    try {
      const legislationId = await fetchLegislationId(articleId);
      navigate(`/legislation/${legislationId}`);
    } catch (error) {
      console.error('Failed to redirect to legislation:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>

      <ResultsList results={results} onArticleClick={handleArticleClick} />
    </div>
  );
};

const ResultsList = ({ results, onArticleClick }) => {
  if (results.length === 0) {
    return <p className="text-gray-500">No results found</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {results.map((result) => (
        <div key={result.id} className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">
            {result?.title || 'No Title'}
          </h2>
          <p 
            dangerouslySetInnerHTML={{ __html: result.excerpt?.rendered || 'No Excerpt' }} 
            className="text-gray-700"
          ></p>
          {result.subtype === 'article' ? (
            <button onClick={() => onArticleClick(result.id)} className="text-blue-500 hover:underline">
              View Details
            </button>
          ) : (
            <Link
              to={`/legislation/${result.id}`}
              className="text-blue-500 hover:underline"
            >
              View Details
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchComponent;
