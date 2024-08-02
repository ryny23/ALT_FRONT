import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import anime from '../assets/anime.svg';
import parse from 'html-react-parser';
import { FaPlusCircle } from 'react-icons/fa';

const LegislationDetail = () => {
  const { id } = useParams();
  const [legislation, setLegislation] = useState(null);
  const [details, setDetails] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoints = ['titres', 'chapitres', 'sections', 'articles'];

  useEffect(() => {
    const fetchLegislation = async () => {
      try {
        const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${id}`);
        setLegislation(res.data);

        const identifiers = res.data.acf.titre_ou_chapitre_ou_section_ou_articles;
        const decisionIdentifiers = res.data.acf.decision;
        const commentIdentifiers = res.data.acf.commentaire;

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

  const addToDossier = async (type, itemId) => {
    try {
      const token = localStorage.getItem('token'); // Assume token is stored in localStorage
      const userRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userRes.data;
      const updatedDossier = { ...user.acf.dossier };

      if (!updatedDossier[type].includes(itemId)) {
        updatedDossier[type].push(itemId);

        await axios.put(
          'https://alt.back.qilinsa.com/wp-json/wp/v2/users/me',
          {
            acf: {
              dossier: updatedDossier,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Added to dossier');
      } else {
        alert('Already in dossier');
      }
    } catch (err) {
      console.error('Error adding to dossier', err);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      <Nav />
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-gray-50 p-4 rounded shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Sommaire</h2>
          <ul className="space-y-2">
            {details.map((item, index) => (
              <li key={index}>
                <a
                  onClick={() => scrollToSection(`detail-${item.id}`)}
                  className="cursor-pointer text-blue-500 hover:underline"
                >
                  {parse(item.title.rendered)}
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
                <ul className="ml-4 space-y-2">
                  {decisions.map((decision, index) => (
                    <li key={index}>
                      <a
                        onClick={() => scrollToSection(`decision-${decision.id}`)}
                        className="cursor-pointer text-blue-500 hover:underline"
                      >
                        {parse(decision.title.rendered)}
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
                <ul className="ml-4 space-y-2">
                  {comments.map((comment, index) => (
                    <li key={index}>
                      <a
                        onClick={() => scrollToSection(`comment-${comment.id}`)}
                        className="cursor-pointer text-blue-500 hover:underline"
                      >
                        {parse(comment.title.rendered)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </aside>
        <main className="lg:col-span-3 bg-white p-6 rounded shadow">
          <div className="text-gray-700 text-lg leading-relaxed">
            <h1 className="text-3xl font-bold mb-6">{legislation.title.rendered}</h1>
            <div dangerouslySetInnerHTML={{ __html: legislation.content.rendered }} className="mb-6" />
            <div>
              {details.map((item, index) => (
                <div key={index} className="mb-6" id={`detail-${item.id}`}>
                  <h3 className="text-xl font-semibold mb-2">
                    {parse(item.title.rendered)}
                    <FaPlusCircle
                      onClick={() => addToDossier('articles', item.id)}
                      className="inline ml-2 cursor-pointer text-green-500 hover:text-green-700"
                    />
                  </h3>
                  <div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />
                </div>
              ))}
            </div>
            {decisions.length > 0 && (
              <div id="decisions" className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Décisions</h2>
                {decisions.map((decision, index) => (
                  <div key={index} className="mb-6" id={`decision-${decision.id}`}>
                    <h3 className="text-xl font-semibold mb-2">
                      {parse(decision.title.rendered)}
                      <FaPlusCircle
                        onClick={() => addToDossier('decision', decision.id)}
                        className="inline ml-2 cursor-pointer text-green-500 hover:text-green-700"
                      />
                    </h3>
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
                    <h3 className="text-xl font-semibold mb-2">{parse(comment.title.rendered)}</h3>
                    <div dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LegislationDetail;
