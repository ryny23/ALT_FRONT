import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import anime from '../assets/anime.svg';
import parse from 'html-react-parser';

const LegislationDetail = () => {
  const { id } = useParams();
  const [legislation, setLegislation] = useState(null);
  const [details, setDetails] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [comments, setComments] = useState([]);
  const [DateEntree, setDateEntree] = useState([]);
  const [DateModif, setDateModif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoints = ['titres', 'chapitres', 'sections', 'articles'];

  useEffect(() => {
    const fetchLegislation = async () => {
      try {
        const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${id}`);
        setLegislation(res.data);

        const identifiers = res.data.acf.titre_ou_chapitre_ou_section_ou_articles;
        const decisionIdentifiers = res.data.acf.decision.slice(0, 3);
        const commentIdentifiers = res.data.acf.commentaire.slice(0, 3);

        const DateEntreeApi = res.data.acf.date_entree;
        if (DateEntreeApi) {
          const year = DateEntreeApi.substr(0, 4);
          const month = DateEntreeApi.substr(4, 2);
          const day = DateEntreeApi.substr(6, 2);
          const formattedDate_entree = `${year}-${month}-${day}`;
          setDateEntree(formattedDate_entree);
        }

        const DateModifApi = res.data.acf.date_modif;
        if (DateModifApi) {
          const year = DateModifApi.substr(0, 4);
          const month = DateModifApi.substr(4, 2);
          const day = DateModifApi.substr(6, 2);
          const formattedDate_modif = `${year}-${month}-${day}`;
          setDateModif(formattedDate_modif);
        }

        const fetchData = async (id) => {
          for (let endpoint of endpoints) {
            try {
              const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/${endpoint}/${id}`);
              if (res.data) return { ...res.data, endpoint };
            } catch (err) {
              // Continue to the next endpoint if not found
            }
          }
          throw new Error('Data not found in any endpoint');
        };

        const fetchDecisions = async (id) => {
          try {
            const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/decisions/${id}`);
            return res.data;
          } catch (err) {
            throw new Error('Decision not found');
          }
        };

        const fetchComments = async (id) => {
          try {
            const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires/${id}`);
            return res.data;
          } catch (err) {
            throw new Error('Comment not found');
          }
        };

        const detailsData = await Promise.all(identifiers.map(fetchData));
        const decisionsData = await Promise.all(decisionIdentifiers.map(fetchDecisions));
        const commentsData = await Promise.all(commentIdentifiers.map(fetchComments));

        

        setDetails(detailsData);
        setDecisions(decisionsData);
        setComments(commentsData);
      } catch (err) {
        setError('Failed to fetch legislation or details');
      } finally {
        setLoading(false);
      }
    };

    fetchLegislation();
  }, [id]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const extractLastPart = (text) => {
    const parts = text.split(' &#8211; ');
    return parts[parts.length - 1];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading animation" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 dark:bg-gray-700 p-4 rounded-xl shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Sommaire</h2>
          <ul className="space-y-2">
            {details.map((item, index) => (
              <li key={index}>
                <a
                  onClick={() => scrollToSection(`detail-${item.id}`)}
                  className="cursor-pointer text-blue-500 text-sm text-start dark:text-blue-200 hover:underline"
                >
                  {extractLastPart(parse(item.title.rendered))} {/* Affiche uniquement la dernière partie */}
              
                </a>
              </li>
            ))}
            {decisions.length > 0 && (
              <li>
                <a
                  onClick={() => scrollToSection('decisions')}
                  className="cursor-pointer text-xl font-bold mb-4"
                >
                  Décisions
                </a>
                <ul className=" space-y-2">
                  {decisions.map((decision, index) => (
                    <li key={index}>
                      <a
                        onClick={() => scrollToSection(`decision-${decision.id}`)}
                        className="cursor-pointer text-blue-500 text-sm text-start dark:text-blue-200 hover:underline"
                      >
                        {extractLastPart(decision.title.rendered)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            {comments.length > 0 && (
              <li>
                <a
                  onClick={() => scrollToSection('comments')}
                  className="cursor-pointer text-xl font-bold mb-4"
                >
                  Commentaires
                </a>
                <ul className="space-y-2">
                  {comments.map((comment, index) => (
                    <li key={index}>
                      <a
                        onClick={() => scrollToSection(`comment-${comment.id}`)}
                        className="cursor-pointer text-blue-500 text-sm text-start dark:text-blue-100 hover:underline"
                      >
                        {extractLastPart(comment.title.rendered)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </aside>
        <main className="lg:col-span-3 dark:bg-gray-800 p-6 rounded shadow">
          <div className="text-lg leading-relaxed">
            <h1 className="text-3xl font-bold mb-6">{parse(legislation.title.rendered)}</h1>
            <div dangerouslySetInnerHTML={{ __html: legislation.content.rendered }} className="mb-6" />
            Date d'entrée : {DateEntree} <br/>
            Date derniere modif : {DateModif} <br/><br/>
            <div>
              {details.map((item, index) => (
                <div key={index} className="mb-6" id={`detail-${item.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{extractLastPart(parse(item.title.rendered))}</h3>
                  <div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />
                </div>
              ))}
            </div>
            {decisions.length > 0 && (
              <div id="decisions" className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Décisions</h2>
                {decisions.map((decision, index) => (
                  <div key={index} className="mb-6" id={`decision-${decision.id}`}>
                    <h3 className="text-xl font-semibold mb-2">{extractLastPart(decision.title.rendered)}</h3>
                    <div dangerouslySetInnerHTML={{ __html: decision.content.rendered }} />
                  </div>
                ))}
              </div>
            )}
            {comments.length > 0 && (
              <div id="comments" className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Commentaires</h2>
                {comments.map((comment, index) => (
                  <div key={index} className="mb-6" id={`comment-${comment.id}`}>
                    <h3 className="text-xl font-semibold mb-2">{extractLastPart(comment.title.rendered)}</h3>
                    <div dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
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

export default LegislationDetail;
