import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import anime from '../assets/anime.svg';
import parse from 'html-react-parser';

const SingleDecision = () => {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/decisions/${id}`);
        setDecision(res.data);

        // Vérifiez si la décision a des commentaires avant de les récupérer
        if (res.data.acf.commentaire_decision && res.data.acf.commentaire_decision.length > 0) {
          const commentIdentifiers = res.data.acf.commentaire_decision.slice(0, 3);

          const fetchComments = async (id) => {
            try {
              const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires/${id}`);
              return res.data;
            } catch (err) {
              console.warn(`Comment with id ${id} not found`);
              return null;
            }
          };

          const commentsData = await Promise.all(commentIdentifiers.map(fetchComments));
          setComments(commentsData.filter(comment => comment !== null));
        }
      } catch (err) {
        setError('Failed to fetch decision');
      } finally {
        setLoading(false);
      }
    };

    fetchDecision();
  }, [id]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
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

  if (!decision) return <p className="text-center">No decision found</p>;

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="flex-1 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 dark:bg-gray-700 p-4 rounded-xl shadow lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Autour de la decision</h2>
          <ul className="space-y-2">
            {comments.length > 0 && (
              <li>
                <a onClick={() => scrollToSection('comments')} className="cursor-pointer text-blue-500 hover:underline">
                  Commentaires
                </a>
              </li>
            )}
            <h2 className="text-xl font-bold mb-4">Texte Integral</h2>
            <li>
              <a onClick={() => scrollToSection('title')} className="cursor-pointer text-blue-500 hover:underline">
                Titre
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('descriptif')} className="cursor-pointer text-blue-500 hover:underline">
                Descriptif
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('resume')} className="cursor-pointer text-blue-500 hover:underline">
                Résumé
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('informations')} className="cursor-pointer text-blue-500 hover:underline">
                Informations
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('text')} className="cursor-pointer text-blue-500 hover:underline">
                Texte de la decision
              </a>
            </li>
          </ul>
        </aside>
        <main className="lg:col-span-3 dark:bg-gray-800 p-6 rounded shadow">
          <div className="text-lg leading-relaxed">
            <h1 id="title" className="text-3xl font-bold mb-6">{parse(decision.title.rendered)}</h1>
            <div id="descriptif" className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Descriptif</h3>
              <div dangerouslySetInnerHTML={{ __html: decision.excerpt.rendered }} />
            </div>
            <div id="resume" className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Résumé</h3>
              <p>{decision.acf.resume}</p>
            </div>
            <div id="informations" className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Informations</h3>
              <p>{decision.acf.information}</p>
            </div>
            <div id="text" className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Texte Integral</h3>
              <div dangerouslySetInnerHTML={{ __html: decision.content.rendered }} />
            </div>
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
    </div>
  );
};

export default SingleDecision;