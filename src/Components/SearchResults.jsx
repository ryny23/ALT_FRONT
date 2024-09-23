import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { NavLink, useLocation, useNavigate, useOutletContext } from 'react-router-dom';

const categoryMapping = {
  all: { display: "Tout", type: "all" },
  legislation: { display: "Législations", type: "legislation" },
  decision: { display: "Décisions", type: "decision" },
  commentaire: { display: "Commentaires", type: "commentaire" },
  article: { display: "Articles", type: "article" },
};

const legislationSubTypes = {
  all: "Toutes les législations",
  general: "Général",
  loi: "Loi",
  documentParlementaire: "Document Parlementaire"
};

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get('query') || '';
  const [resultCounts, setResultCounts] = useState({});
  const [articleExcerpts, setArticleExcerpts] = useState({});
  const [legislationTitles, setLegislationTitles] = useState({});
  const { activeSearchCategory, setActiveSearchCategory } = useOutletContext();
  const [selectedCategory, setSelectedCategory] = useState(activeSearchCategory || 'all');
  const [selectedLegislationSubType, setSelectedLegislationSubType] = useState('all');
  const [similarResults, setSimilarResults] = useState([]);
  const [relatedLegislations, setRelatedLegislations] = useState([]);

  useEffect(() => {
    setSelectedCategory(activeSearchCategory);
  }, [activeSearchCategory]);

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
    setActiveSearchCategory(category);
    if (category !== 'legislation') {
      setSelectedLegislationSubType('all');
    }
  }, [setActiveSearchCategory]);

  const handleLegislationSubTypeClick = useCallback((subType) => {
    setSelectedLegislationSubType(subType);
  }, []);

  const handleShowAll = useCallback(() => {
    setSelectedCategory('all');
    setActiveSearchCategory('all');
    setSelectedLegislationSubType('all');
  }, [setActiveSearchCategory]);

  const handleResultClick = useCallback((result) => {
    const basePath = `/dashboard/${result.type}/${result.id}`;
    navigate(basePath);
  }, [navigate]);

  const fetchData = useCallback(async (endpoint) => {
    try {
      const altUrl = 'https://alt.back.qilinsa.com';
      const response = await axios.get(`${altUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }, []);

  const fetchArticleData = useCallback(async (articleId) => {
    try {
      const articleData = await fetchData(`/wp-json/wp/v2/articles/${articleId}`);
      setArticleExcerpts(prev => ({
        ...prev,
        [articleId]: articleData?.content?.rendered || 'Pas de contenu'
      }));

      const legislationId = articleData.acf.Legislation_ou_titre_ou_chapitre_ou_section;
      if (legislationId) {
        const legislationData = await fetchData(`/wp-json/wp/v2/legislations/${legislationId}`);
        setLegislationTitles(prev => ({
          ...prev,
          [articleId]: {
            title: legislationData?.title?.rendered || 'Titre de législation non trouvé',
            id: legislationId,
          }
        }));
      }
    } catch (error) {
      console.error(`Échec de la récupération des données pour l'article ${articleId}:`, error);
    }
  }, [fetchData]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError('');
      setResults([]);
      setSimilarResults([]);
      setRelatedLegislations([]);

      try {
        const endpoints = [
          `/wp-json/wp/v2/decisions?search=${query}`,
          `/wp-json/wp/v2/legislations?search=${query}`,
          `/wp-json/wp/v2/commentaires?search=${query}`,
          `/wp-json/wp/v2/articles?search=${query}`,
        ];

        const [decisions, allLegislations, commentaires, articles] = await Promise.all(
          endpoints.map(fetchData)
        );

        const legislations = allLegislations.filter(leg => !leg.categories_legislations.includes(11) && !leg.categories_legislations.includes(14));
        const lois = allLegislations.filter(leg => leg.categories_legislations.includes(14));
        const documentsParlementaires = allLegislations.filter(leg => leg.categories_legislations.includes(11));

        const combinedResults = [
          ...decisions.map(item => ({ ...item, type: 'decision' })),
          ...legislations.map(item => ({ ...item, type: 'legislation', subType: 'general' })),
          ...lois.map(item => ({ ...item, type: 'legislation', subType: 'loi' })),
          ...documentsParlementaires.map(item => ({ ...item, type: 'legislation', subType: 'documentParlementaire' })),
          ...commentaires.map(item => ({ ...item, type: 'commentaire' })),
          ...articles.map(item => ({ ...item, type: 'article' })),
        ];

        setResults(combinedResults);
        setResultCounts({
          decisions: decisions.length,
          legislations: legislations.length + lois.length + documentsParlementaires.length,
          commentaires: commentaires.length,
          articles: articles.length,
          all: combinedResults.length,
        });

        await Promise.all(combinedResults
          .filter(result => result.type === 'article')
          .map(result => fetchArticleData(result.id))
        );

        const articlesWithLegislations = combinedResults
          .filter(result => result.type === 'article' && legislationTitles[result.id])
          .map(article => ({
            ...article,
            associatedLegislation: legislationTitles[article.id]
          }));

        // Regrouper les législations associées
        const relatedLegislationsMap = articlesWithLegislations.reduce((acc, article) => {
          const legislationId = article.associatedLegislation.id;
          if (!acc[legislationId]) {
            acc[legislationId] = {
              ...article.associatedLegislation,
              relatedArticles: []
            };
          }
          acc[legislationId].relatedArticles.push(article);
          return acc;
        }, {});

        setRelatedLegislations(Object.values(relatedLegislationsMap));

        // Mise à jour des résultats similaires
        const similar = [
          ...articlesWithLegislations,
          ...legislations,
          ...lois,
          ...documentsParlementaires,
          ...Object.values(relatedLegislationsMap)
        ].filter(result => 
          result.title.rendered.toLowerCase().includes(query.toLowerCase()) ||
          (result.type === 'article' && articleExcerpts[result.id]?.toLowerCase().includes(query.toLowerCase())) ||
          (result.relatedArticles && result.relatedArticles.some(article => 
            articleExcerpts[article.id]?.toLowerCase().includes(query.toLowerCase())
          ))
        ).slice(0, 10);

        setSimilarResults(similar);

      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, fetchData, fetchArticleData]);


  const highlightText = useCallback((text) => {
    if (!text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  }, [query]);

  const createExcerpt = useCallback((text) => {
    if (!text || !query) return text;
    const queryIndex = text.toLowerCase().indexOf(query.toLowerCase());
    if (queryIndex === -1) return text.substring(0, 400);
    const start = Math.max(queryIndex - 200, 0);
    const end = Math.min(start + 400, text.length);
    return text.substring(start, end);
  }, [query]);


  const filteredResults = results.filter(result => 
    (selectedCategory === 'all' || result.type === selectedCategory) &&
    (selectedCategory !== 'legislation' || selectedLegislationSubType === 'all' || result.subType === selectedLegislationSubType)
  );

  return (
    <section className="px-4 md:px-8 pt-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4 flex flex-wrap font-medium justify-center items-center space-x-2 md:space-x-4">
        {Object.entries(categoryMapping).map(([key, value]) => (
          <CategoryButton
            key={key}
            category={key}
            display={value.display}
            count={resultCounts[key === 'all' ? 'all' : `${key}s`]}
            selectedCategory={selectedCategory}
            onClick={key === 'all' ? handleShowAll : handleCategoryClick}
          />
        ))}
      </div>
      
      {selectedCategory === 'legislation' && (
        <div className="mb-4 flex flex-wrap font-medium justify-center items-center space-x-2 md:space-x-4">
          {Object.entries(legislationSubTypes).map(([key, value]) => (
            <CategoryButton
              key={key}
              category={key}
              display={value}
              count={key === 'all' ? resultCounts.legislations : results.filter(r => r.type === 'legislation' && r.subType === key).length}
              selectedCategory={selectedLegislationSubType}
              onClick={handleLegislationSubTypeClick}
            />
          ))}
        </div>
      )}
      
      {loading && <div className='text-center my-28 text-3xl'>Recherche en cours...</div>}
      
      {!loading && (
        <>
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  handleResultClick={handleResultClick}
                  highlightText={highlightText}
                  createExcerpt={createExcerpt}
                  legislationTitles={legislationTitles}
                  articleExcerpts={articleExcerpts}
                  legislationSubTypes={legislationSubTypes}
                />
              ))}
            </div>
          ) : (
            <div className='text-center my-28 text-3xl'>Aucun résultat direct trouvé</div>
          )}
          
          {selectedCategory === 'legislation' && 
           (relatedLegislations.length > 0 || similarResults.length > 0) && (
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Résultats similaires et législations associées</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedLegislations.map((legislation) => (
                  <RelatedLegislationCard
                    key={legislation.id}
                    legislation={legislation}
                    handleResultClick={handleResultClick}
                    highlightText={highlightText}
                    createExcerpt={createExcerpt}
                    articleExcerpts={articleExcerpts}
                  />
                ))}
                {similarResults.map((result) => (
                  <SimilarResultCard
                    key={result.id}
                    result={result}
                    handleResultClick={handleResultClick}
                    highlightText={highlightText}
                    createExcerpt={createExcerpt}
                    legislationSubTypes={legislationSubTypes}
                    articleExcerpts={articleExcerpts}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

const CategoryButton = React.memo(({ category, display, count, selectedCategory, onClick }) => (
  <span
    className={`cursor-pointer px-2 py-1 rounded ${selectedCategory === category ? 'bg-green-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    onClick={() => onClick(category)}
  >
    {display} ({count})
  </span>
));

const ResultCard = React.memo(({ result, handleResultClick, highlightText, createExcerpt, legislationTitles, articleExcerpts, legislationSubTypes }) => (
  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-300">
    <h3
      className="text-lg font-bold cursor-pointer hover:text-green-400 mb-2"
      onClick={() => handleResultClick(result)}
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(result.title.rendered) }} />
    </h3>
    <p className="text-sm text-gray-600 mb-2">
      {result.type === 'legislation' 
        ? `Législation : ${result.subType === 'general' ? '' : legislationSubTypes[result.subType]}`
        : result.type.charAt(0).toUpperCase() + result.type.slice(1)}
    </p>

    {result.type === 'article' && legislationTitles[result.id] && (
      <p className="text-gray-600 mb-2 text-sm">
        Législation associée:{' '}
        <NavLink
          to={`/dashboard/legislation/${legislationTitles[result.id].id}`}
          className="cursor-pointer text-green-500 hover:underline">
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
));


const RelatedLegislationCard = React.memo(({ legislation, handleResultClick, highlightText, createExcerpt, articleExcerpts }) => (
  <div 
    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-300 cursor-pointer"
    onClick={() => handleResultClick(legislation)}
  >
    <h3 className="text-md font-semibold mb-2">
      <span dangerouslySetInnerHTML={{ __html: highlightText(legislation.title) }} />
    </h3>
    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
      Législation associée à {legislation.relatedArticles.length} article(s)
    </p>
    <div className="text-xs">
      {legislation.relatedArticles.slice(0, 2).map(article => (
        <div key={article.id} className="mb-2">
          <strong>{article.title.rendered}</strong>
          <p>
            <span dangerouslySetInnerHTML={{ __html: highlightText(createExcerpt(articleExcerpts[article.id])) }} />
          </p>
        </div>
      ))}
      {legislation.relatedArticles.length > 2 && (
        <p className="text-gray-500">Et {legislation.relatedArticles.length - 2} autre(s) article(s)</p>
      )}
    </div>
  </div>
));

const SimilarResultCard = React.memo(({ result, handleResultClick, highlightText, createExcerpt, legislationSubTypes, articleExcerpts }) => (
  <div 
    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-300 cursor-pointer"
    onClick={() => handleResultClick(result)}
  >
    <h3 className="text-md font-semibold mb-2">
      <span dangerouslySetInnerHTML={{ __html: highlightText(result.title.rendered) }} />
    </h3>
    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
      {result.type === 'legislation' 
        ? `Législation : ${result.subType === 'general' ? '' : legislationSubTypes[result.subType]}`
        : result.type.charAt(0).toUpperCase() + result.type.slice(1)}
    </p>
    {result.type === 'article' && result.associatedLegislation && (
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        Législation associée: <span dangerouslySetInnerHTML={{ __html: highlightText(result.associatedLegislation.title) }} />
      </p>
    )}
    {result.type === 'article' && articleExcerpts[result.id] && (
      <div className="text-xs">
        <span dangerouslySetInnerHTML={{ __html: highlightText(createExcerpt(articleExcerpts[result.id])) }} />
      </div>
    )}
  </div>
));


export default SearchResults;