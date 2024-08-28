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
    all: results.length,
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
        ];

        const responses = await Promise.all(endpoints.map(endpoint => axios.get(`${altUrl}${endpoint}`)));

        setResultCounts({
          legislations: responses[1]?.data.length || 0,
          decisions: responses[0]?.data.length || 0,
          commentaires: responses[2]?.data.length || 0,
          articles: responses[3]?.data.length || 0,
        });

        const combinedResults = responses.flatMap(response => response.data);

        setResults(combinedResults);

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

  const handleResultClick = (result) => {
    const basePath = `/dashboard/${result.type}/${result.id}`;
    navigate(basePath);
  };

  const highlightText = (text) => {
    if (!text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  const createExcerpt = (text) => {
    if (!text || !query) return text;

    const queryIndex = text.toLowerCase().indexOf(query.toLowerCase());
    if (queryIndex === -1) return text.substring(0, 400); // Return first 400 chars if query not found

    const start = Math.max(queryIndex - 200, 0);
    const end = Math.min(start + 400, text.length);

    return text.substring(start, end);
  };

  return (
    <section className="px-8 pt-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-4 flex font-medium justify-center items-center space-x-4">
        <span
          className={`cursor-pointer ${selectedCategory === 'all' ? 'text-green-500' : ''}`}
          onClick={handleShowAll}
        >
          Tout ({results.length})
        </span>
        <span> | </span>
        <span
          className={`cursor-pointer ${selectedCategory === 'legislation' ? 'text-green-500' : ''}`}
          onClick={() => handleCategoryClick('legislation')}
        >
          Législations ({resultCounts.legislations})
        </span>
        <span> | </span>
        <span
          className={`cursor-pointer ${selectedCategory === 'decision' ? 'text-green-500' : ''}`}
          onClick={() => handleCategoryClick('decision')}
        >
          Décisions ({resultCounts.decisions})
        </span>
        <span> | </span>
        <span
          className={`cursor-pointer ${selectedCategory === 'commentaire' ? 'text-green-500' : ''}`}
          onClick={() => handleCategoryClick('commentaire')}
        >
          Commentaires ({resultCounts.commentaires})
        </span>
        <span> | </span>
        <span
          className={`cursor-pointer ${selectedCategory === 'article' ? 'text-green-500' : ''}`}
          onClick={() => handleCategoryClick('article')}
        >
          Articles ({resultCounts.articles})
        </span>
      </div>
      {loading && <div className='text-center my-28 text-3xl'>Recherche en cours...</div>}
      {results.length === 0 && !loading ? (
        <div className='text-center my-28 text-3xl'>Aucun résultat trouvé</div>
      ) : (
        results.map((result) => (
          <div
            key={result.id}
            className={`p-4 border-b hover:bg-gray-100 dark:hover:bg-gray-700
              ${selectedCategory !== 'all' && selectedCategory !== result.type ? 'hidden' : ''}`}
          >
            <h3
              className="text-lg font-bold cursor-pointer hover:text-green-400"
              onClick={() => handleResultClick(result)}
            >
              <span dangerouslySetInnerHTML={{ __html: highlightText(result.title.rendered) }} />
            </h3>
            <p>{result.type}</p>

            {result.type === 'article' && legislationTitles[result.id] && (
              <p className="text-gray-600 mb-2">
                Législation associée:{' '}
                <NavLink
                  to={`/dashboard/legislation/${legislationTitles[result.id].id}`}
                  className="cursor-pointer text-green-500 hover:underline"
                >
                  <span dangerouslySetInnerHTML={{ __html: highlightText(legislationTitles[result.id].title) }} />
                </NavLink>
              </p>
            )}

            {result.excerpt?.rendered ? (
              <div
                className="mb-2 text-sm"
                dangerouslySetInnerHTML={{ __html: highlightText(createExcerpt(result.excerpt.rendered)) }}
              />
            ) : (
              <div className="mb-2 text-sm">
                <span dangerouslySetInnerHTML={{ __html: highlightText(createExcerpt(result.content?.rendered || 'Pas de contenu')) }} />
              </div>
            )}
          </div>
        )))}
      </section>
  );
};

export default SearchResults;
