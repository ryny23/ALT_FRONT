import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import anime from '../assets/anime.svg'

const SingleArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [titreTitle, setTitreTitle] = useState('');
  const [legislationTitle, setLegislationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decisions, setDecisions] = useState([]);
  const [commentaires, setCommentaires] = useState([]);
  const titreDataRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const altUrl = 'https://alt.back.qilinsa.com';

        // Fetch article details
        const articleResponse = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${id}`);
        const articleData = articleResponse.data;

        // Extract section ID from article data
        const sectionId = articleData.acf.section;

        // Fetch section details
        const sectionResponse = await axios.get(articleData._links['acf:post'].find(link => link.href.includes('sections')).href);
        const sectionData = sectionResponse.data;

        // Extract chapter ID from section data
        const chapterId = sectionData.acf.chapitre;

        // Fetch chapter details
        const chapterResponse = await axios.get(sectionData._links['acf:post'].find(link => link.href.includes('chapitres')).href);
        const chapterData = chapterResponse.data;

        // Extract titre ID from chapter data
        const titreId = chapterData.acf.titre;

        // Fetch titre details
        const titreResponse = await axios.get(chapterData._links['acf:post'].find(link => link.href.includes('titres')).href);
        const titreData = titreResponse.data;

        // Extract legislation ID from titre data
        const legislationId = titreData.acf.legislation;

        // Fetch legislation details
        const legislationResponse = await axios.get(titreData._links['acf:post'].find(link => link.href.includes('legislations')).href);
        const legislationData = legislationResponse.data;

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
        setSectionTitle(sectionData.title.rendered);
        setChapterTitle(chapterData.title.rendered);
        setTitreTitle(titreData.title.rendered);
        setLegislationTitle(legislationData.title.rendered);
        setDecisions(fetchedDecisions);
        setCommentaires(fetchedCommentaires);
        setLoading(false);

        titreDataRef.current = titreData;
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const navigateToLegislation = async () => {
    try {
      if (!titreDataRef.current) {
        console.error('titreData is not yet available');
        return;
      }

      const altUrl = 'https://alt.back.qilinsa.com';

      // Fetch the current legislation data again to get the correct link
      const legislationResponse = await axios.get(titreDataRef.current._links['acf:post'].find(link => link.href.includes('legislations')).href);
      const legislationData = legislationResponse.data;

      // Use navigate function to navigate programmatically
      navigate(`/legislation/${legislationData.id}`);
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
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ">
      <Nav />
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 bg-gray-50 p-4 rounded shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Sommaire</h2>
            <h4 className="text-x font-bold mb-4">Décisions associé</h4>
            <ul className="">
              {decisions.map(decision => (
                <li key={decision.id}>
                  <a onClick={() => document.getElementById(`decision-${decision.id}`).scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer text-blue-500 hover:underline">
                    {decision.title.rendered}
                  </a>
                </li>
              ))}
              <h4 className="text-x font-bold mb-4 mt-2">Commentaires associé</h4>
              {commentaires.map(commentaire => (
                <li key={commentaire.id}>
                  <a onClick={() => document.getElementById(`commentaire-${commentaire.id}`).scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer text-blue-500 hover:underline">
                     {commentaire.title.rendered}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        <main className="lg:col-span-3 bg-white p-6 rounded shadow">
          
          <div className="text-gray-700 text-lg leading-relaxed">
            <h1 className="text-2xl text-gray-800 font-semibold mb-4 mt-4">{article.title.rendered}</h1>
            <p className="mb-2 cursor-pointer text-blue-500 hover:underline" onClick={navigateToLegislation}>
              Legislation: {legislationTitle}
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
      <Footer />
    </div>
  );
};

export default SingleArticle;
