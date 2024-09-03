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
    const fetchArticleAndLegislation = async () => {
      try {
        const altUrl = 'https://alt.back.qilinsa.com';

        // Fetch article details
        const articleResponse = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${id}`);
        const articleData = articleResponse.data;

        // Extract the identifier from the Legislation_ou_titre_ou_chapitre_ou_section field
        const relatedId = articleData.acf.Legislation_ou_titre_ou_chapitre_ou_section;
        

        // Fetch the legislation details
        const legislationResponse = await axios.get(`${altUrl}/wp-json/wp/v2/legislations/${relatedId}`);
        const legislationData = legislationResponse.data;
        console.error(relatedId);

        // Fetch decisions
        const decisionPromises = articleData.acf.decision.map(decisionId => 
          axios.get(`${altUrl}/wp-json/wp/v2/decisions/${decisionId}`)
        );
        const decisionResults = await Promise.all(decisionPromises);
        const fetchedDecisions = decisionResults.map(result => result.data);

        // Fetch commentaires
        const commentairePromises = articleData.acf.commentaire.map(commentaireId => 
          axios.get(`${altUrl}/wp-json/wp/v2/commentaires/${commentaireId}`)
        );
        const commentaireResults = await Promise.all(commentairePromises);
        const fetchedCommentaires = commentaireResults.map(result => result.data);

        setArticle(articleData);
        setLegislationTitle(legislationData.title.rendered);
        setDecisions(fetchedDecisions);
        setCommentaires(fetchedCommentaires);
        setLoading(false);

        legislationDataRef.current = legislationData;
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchArticleAndLegislation();
  }, [id]);

  const navigateToLegislation = () => {
    try {
      if (!legislationDataRef.current) {
        console.error('Legislation data is not yet available');
        return;
      }

      navigate(`/dashboard/legislation/${legislationDataRef.current.id}`);
    } catch (error) {
      console.error('Failed to navigate to legislation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading animation" />
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  if (!article) return <div>No article found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 p-4 rounded shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Sommaire</h2>
          <h4 className="text-x font-bold mb-4">Décisions associé</h4>
          <ul>
            {decisions.map(decision => (
              <li key={decision.id}>
                <a onClick={() => document.getElementById(`decision-${decision.id}`).scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer text-green-500 hover:underline">
                  {decision.title.rendered}
                </a>
              </li>
            ))}
            <h4 className="text-x font-bold mb-4 mt-2">Commentaires associé</h4>
            {commentaires.map(commentaire => (
              <li key={commentaire.id}>
                <a onClick={() => document.getElementById(`commentaire-${commentaire.id}`).scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer text-green-500 hover:underline">
                  {commentaire.title.rendered}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <main className="lg:col-span-3  p-6 rounded shadow">
          <div className=" text-lg leading-relaxed">
            <h1 className="text-2xl font-semibold mb-4 mt-4">{article.title.rendered}</h1>
            <p className="mb-2" onClick={navigateToLegislation}>
              Législation associée:<span className="ml-2 cursor-pointer text-green-500 hover:underline">{legislationTitle}</span>
            </p>
            <div className="pb-6">{parse(article.content.rendered)}</div>
            <div>
              <h2 className='text-xl font-bold my-4'>Decisions associé</h2>
              {decisions.map(decision => (
                <div key={decision.id} className="mb-6" id={`decision-${decision.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{decision.title.rendered}</h3>
                  <div dangerouslySetInnerHTML={{ __html: decision.content.rendered }} />
                </div>
              ))}
              <h2 className='text-xl font-bold my-4'>Commentaires associé</h2>
              {commentaires.map(commentaire => (
                <div key={commentaire.id} className="mb-6" id={`commentaire-${commentaire.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{commentaire.title.rendered}</h3>
                  <div dangerouslySetInnerHTML={{ __html: commentaire.content.rendered }} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArticleDetail;
