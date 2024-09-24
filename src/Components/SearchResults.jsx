import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const SearchResults = ({ activePage }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get('query') || '';
  const [resultCounts, setResultCounts] = useState({
    legislations: 0,
    decisions: 0,
    commentaires: 0,
    articles: 0,
    lois: 0,
    documentsParlementaires: 0,
    all: 0,
  });
  const [articleExcerpts, setArticleExcerpts] = useState({});
  const [legislationTitles, setLegislationTitles] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleShowAll = () => {
    setSelectedCategory('all');
  };

  const handleResultClick = (result) => {
    const basePath = `/dashboard/${result.type}/${result.id}`;
    navigate(basePath);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError('');
      setResults([]);

      try {
        const altUrl = 'https://alt.back.qilinsa.com';
        const endpoints = [
          `/wp-json/wp/v2/decisions?search=${query}`,
          `/wp-json/wp/v2/legislations?search=${query}`,
          `/wp-json/wp/v2/commentaires?search=${query}`,
          `/wp-json/wp/v2/articles?search=${query}`,
          `/wp-json/wp/v2/legislations?categories_legislations=14&search=${query}`,
          `/wp-json/wp/v2/legislations?categories_legislations=11&search=${query}`,
        ];

        const responses = await Promise.all(endpoints.map(endpoint => axios.get(`${altUrl}${endpoint}`)));

        const [decisions, legislations, commentaires, articles, lois, documentsParlementaires] = responses.map(response => response.data);

        setResultCounts({
          decisions: decisions.length,
          legislations: legislations.length,
          commentaires: commentaires.length,
          articles: articles.length,
          lois: lois.length,
          documentsParlementaires: documentsParlementaires.length,
        });

        const combinedResults = [
          ...decisions.map(item => ({ ...item, type: 'decision' })),
          ...legislations.map(item => ({ ...item, type: 'legislation' })),
          ...commentaires.map(item => ({ ...item, type: 'commentaire' })),
          ...articles.map(item => ({ ...item, type: 'article' })),
          ...lois.map(item => ({ ...item, type: 'loi' })),
          ...documentsParlementaires.map(item => ({ ...item, type: 'documentParlementaire' })),
        ];

        setResults(combinedResults);
        setResultCounts(prevCounts => ({
          ...prevCounts,
          all: combinedResults.length,
        }));

        combinedResults.forEach(result => {
          if (result.type === 'article' && !articleExcerpts[result.id]) {
            fetchArticleExcerpt(result.id);
            fetchLegislationTitle(result.id);
          }
        });
      } catch (err) {
        setError('Une erreur est survenue lors de la recherche');
      } finally {
        setLoading(false);
      }
    };

    const fetchArticleExcerpt = async (articleId) => {
      try {
        const response = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles/${articleId}`);
        const excerpt = response.data?.content?.rendered || 'Pas de contenu';
        setArticleExcerpts((prevExcerpts) => ({
          ...prevExcerpts,
          [articleId]: excerpt,
        }));
      } catch (error) {
        console.error(`Échec de la récupération de l'extrait pour l'article ${articleId}:`, error);
        setArticleExcerpts((prevExcerpts) => ({
          ...prevExcerpts,
          [articleId]: 'Échec de la récupération du contenu',
        }));
      }
    };

    const fetchLegislationTitle = async (articleId) => {
      try {
        const altUrl = 'https://alt.back.qilinsa.com';
        const articleResponse = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${articleId}`);
        const articleData = articleResponse.data;

        const legislationId = articleData.acf.Legislation_ou_titre_ou_chapitre_ou_section;
        if (!legislationId) throw new Error("ID de législation non trouvé");

        const legislationResponse = await axios.get(`${altUrl}/wp-json/wp/v2/legislations/${legislationId}`);
        const legislationTitle = legislationResponse.data?.title?.rendered || 'Titre de législation non trouvé';

        setLegislationTitles((prevTitles) => ({
          ...prevTitles,
          [articleId]: {
            title: legislationTitle,
            id: legislationId,
          },
        }));
      } catch (error) {
        console.error(`Échec de la récupération de la législation pour l'article ${articleId}:`, error);
        setLegislationTitles((prevTitles) => ({
          ...prevTitles,
          [articleId]: 'Échec de la récupération de la législation',
        }));
      }
    };

    fetchResults();
  }, [query]);

  const highlightText = (text) => {
    if (!text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  const createExcerpt = (text) => {
    if (!text || !query) return text;

    const queryIndex = text.toLowerCase().indexOf(query.toLowerCase());
    if (queryIndex === -1) return text.substring(0, 400);

    const start = Math.max(queryIndex - 200, 0);
    const end = Math.min(start + 400, text.length);

    return text.substring(start, end);
  };

  return (
    <section className="px-4 md:px-8 pt-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-4 flex flex-wrap font-medium justify-center items-center space-x-2 md:space-x-4">
        <CategoryButton category="all" count={resultCounts.all} selectedCategory={selectedCategory} onClick={handleShowAll} />
        <CategoryButton category="legislation" count={resultCounts.legislations} selectedCategory={selectedCategory} onClick={handleCategoryClick} />
        <CategoryButton category="decision" count={resultCounts.decisions} selectedCategory={selectedCategory} onClick={handleCategoryClick} />
        <CategoryButton category="commentaire" count={resultCounts.commentaires} selectedCategory={selectedCategory} onClick={handleCategoryClick} />
        <CategoryButton category="article" count={resultCounts.articles} selectedCategory={selectedCategory} onClick={handleCategoryClick} />
        <CategoryButton category="loi" count={resultCounts.lois} selectedCategory={selectedCategory} onClick={handleCategoryClick} />
        <CategoryButton category="documentParlementaire" count={resultCounts.documentsParlementaires} selectedCategory={selectedCategory} onClick={handleCategoryClick} />
      </div>
      {loading && <div className='text-center my-28 text-3xl'>Recherche en cours...</div>}
      {results.length === 0 && !loading ? (
        <div className='text-center my-28 text-3xl'>Aucun résultat trouvé</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              selectedCategory={selectedCategory}
              handleResultClick={handleResultClick}
              highlightText={highlightText}
              createExcerpt={createExcerpt}
              legislationTitles={legislationTitles}
              articleExcerpts={articleExcerpts}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const CategoryButton = ({ category, count, selectedCategory, onClick }) => (
  <span
    className={`cursor-pointer px-2 py-1 rounded ${selectedCategory === category ? 'bg-green-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    onClick={() => onClick(category)}
  >
    {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
  </span>
);

const ResultCard = ({ result, selectedCategory, handleResultClick, highlightText, createExcerpt, legislationTitles, articleExcerpts }) => (
  <div
    className={`p-4 border rounded-lg hover:shadow-md transition-shadow duration-300
      ${selectedCategory !== 'all' && selectedCategory !== result.type ? 'hidden' : ''}`}
  >
    <h3
      className="text-lg font-bold cursor-pointer hover:text-green-400 mb-2"
      onClick={() => handleResultClick(result)}
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(result.title.rendered) }} />
    </h3>
    <p className="text-sm text-gray-600 mb-2">{result.type}</p>

    {result.type === 'article' && legislationTitles[result.id] && (
      <p className="text-gray-600 mb-2 text-sm">
        Législation associée:{' '}
        <NavLink
          to={`/dashboard/legislation/${legislationTitles[result.id].id}`}
          className="cursor-pointer text-green-500 hover:underline"
        >
          <span dangerouslySetInnerHTML={{ __html: highlightText(legislationTitles[result.id].title) }} />
        </NavLink>
      </p>
    )}

    <div className="text-sm">
      {result.type === 'article' && articleExcerpts[result.id] ? (
        <span dangerouslySetInnerHTML={{ __html: highlightText(createExcerpt(articleExcerpts[result.id])) }} />
      ) : (
        <span dangerouslySetInnerHTML={{ __html: highlightText(createExcerpt(result.excerpt?.rendered || result.content?.rendered || 'Pas de contenu')) }} />
      )}
    </div>
  </div>
);

export default SearchResults;