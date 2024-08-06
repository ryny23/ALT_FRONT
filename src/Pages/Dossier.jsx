import React, { useState, useEffect } from 'react';
import axios from 'axios';
import anime from '../assets/anime.svg';

const Dossier = () => {
  const [dossier, setDossier] = useState(null);
  const [articles, setArticles] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [legislations, setLegislations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const dossierData = res.data.acf.dossier;
        setDossier(dossierData);

        // Fetch articles
        const articlesData = await Promise.all(
          dossierData.articles.map(id =>
            axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }).then(res => res.data)
          )
        );
        setArticles(articlesData);

        // Fetch decisions
        const decisionsData = await Promise.all(
          dossierData.decision.map(id =>
            axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/decisions/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }).then(res => res.data)
          )
        );
        setDecisions(decisionsData);

        // Fetch legislations
        const legislationsData = await Promise.all(
          dossierData.legislation.map(id =>
            axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }).then(res => res.data)
          )
        );
        setLegislations(legislationsData);

      } catch (err) {
        setError('Failed to fetch dossier');
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <img src={anime} alt="Loading animation" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Mon Dossier</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Articles</h2>
            <ul className="space-y-2">
              {articles.map((article, index) => (
                <li key={index}>{article.title.rendered}<br/>{article.excerpt.rendered}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Décisions</h2>
            <ul className="space-y-2">
              {decisions.map((decision, index) => (
                <li key={index}>{decision.title.rendered}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Législations</h2>
            <ul className="space-y-2">
              {legislations.map((legislation, index) => (
                <li key={index}>{legislation.title.rendered}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dossier;
