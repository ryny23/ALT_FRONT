import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import anime from '../assets/anime.svg';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [legislationTitle, setLegislationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decisions, setDecisions] = useState([]);
  const [commentaires, setCommentaires] = useState([]);
  const legislationDataRef = useRef(null);

  useEffect(() => {
    const fetchArticleAndRelatedData = async () => {
      try {
        const altUrl = 'https://alt.back.qilinsa.com';

        // Fetch article details
        const articleResponse = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${id}`);
        const articleData = articleResponse.data;
        setArticle(articleData);

        // Fetch legislation details if available
        if (articleData.acf && articleData.acf.Legislation_ou_titre_ou_chapitre_ou_section) {
          try {
            const legislationResponse = await axios.get(`${altUrl}/wp-json/wp/v2/legislations/${articleData.acf.Legislation_ou_titre_ou_chapitre_ou_section}`);
            const legislationData = legislationResponse.data;
            setLegislationTitle(legislationData.title.rendered);
            legislationDataRef.current = legislationData;
          } catch (error) {
            console.error('Failed to fetch legislation:', error);
          }
        }

        // Fetch decisions if available
        if (articleData.acf && articleData.acf.decision && Array.isArray(articleData.acf.decision)) {
          const decisionPromises = articleData.acf.decision.map(decisionId => 
            axios.get(`${altUrl}/wp-json/wp/v2/decisions/${decisionId}`).catch(error => {
              console.error(`Failed to fetch decision ${decisionId}:`, error);
              return null;
            })
          );
          const decisionResults = await Promise.all(decisionPromises);
          const fetchedDecisions = decisionResults.filter(result => result !== null).map(result => result.data);
          setDecisions(fetchedDecisions);
        }

        // Fetch commentaires if available
        if (articleData.acf && articleData.acf.commentaire && Array.isArray(articleData.acf.commentaire)) {
          const commentairePromises = articleData.acf.commentaire.map(commentaireId => 
            axios.get(`${altUrl}/wp-json/wp/v2/commentaires/${commentaireId}`).catch(error => {
              console.error(`Failed to fetch commentaire ${commentaireId}:`, error);
              return null;
            })
          );
          const commentaireResults = await Promise.all(commentairePromises);
          const fetchedCommentaires = commentaireResults.filter(result => result !== null).map(result => result.data);
          setCommentaires(fetchedCommentaires);
        }

        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchArticleAndRelatedData();
  }, [id]);

  const navigateToLegislation = () => {
    if (legislationDataRef.current) {
      navigate(`/dashboard/legislation/${legislationDataRef.current.id}`);
    } else {
      console.error('Legislation data is not available');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading animation" />
      </div>
    );
  }
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!article) return <div className="text-center">No article found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 p-4 rounded shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Sommaire</h2>
          {decisions.length > 0 && (
            <>
              <h4 className="text-lg font-bold mb-4">Décisions associées</h4>
              <ul>
                {decisions.map(decision => (
                  <li key={decision.id}>
                    <a onClick={() => document.getElementById(`decision-${decision.id}`).scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer text-green-500 hover:underline">
                      {decision.title.rendered}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {commentaires.length > 0 && (
            <>
              <h4 className="text-lg font-bold mb-4 mt-2">Commentaires associés</h4>
              <ul>
                {commentaires.map(commentaire => (
                  <li key={commentaire.id}>
                    <a onClick={() => document.getElementById(`commentaire-${commentaire.id}`).scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer text-green-500 hover:underline">
                      {commentaire.title.rendered}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
        <main className="lg:col-span-3 p-6 rounded shadow">
          <div className="text-lg leading-relaxed">
            <h1 className="text-2xl font-semibold mb-4 mt-4">{article.title.rendered}</h1>
            {legislationTitle && (
              <p className="mb-2">
                Législation associée: <span className="ml-2 cursor-pointer text-green-500 hover:underline" onClick={navigateToLegislation}>{legislationTitle}</span>
              </p>
            )}
            <div className="pb-6">{parse(article.content.rendered)}</div>
            {decisions.length > 0 && (
              <div>
                <h2 className='text-xl font-bold my-4'>Décisions associées</h2>
                {decisions.map(decision => (
                  <div key={decision.id} className="mb-6" id={`decision-${decision.id}`}>
                    <h3 className="text-xl font-semibold mb-2">{decision.title.rendered}</h3>
                    <div dangerouslySetInnerHTML={{ __html: decision.content.rendered }} />
                  </div>
                ))}
              </div>
            )}
            {commentaires.length > 0 && (
              <div>
                <h2 className='text-xl font-bold my-4'>Commentaires associés</h2>
                {commentaires.map(commentaire => (
                  <div key={commentaire.id} className="mb-6" id={`commentaire-${commentaire.id}`}>
                    <h3 className="text-xl font-semibold mb-2">{commentaire.title.rendered}</h3>
                    <div dangerouslySetInnerHTML={{ __html: commentaire.content.rendered }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArticleDetail;