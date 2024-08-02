import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import anime from '../assets/anime.svg';

const Dossier = () => {
  const [dossier, setDossier] = useState(null);
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
        setDossier(res.data.acf.dossier);
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
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading animation" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      
      <div className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Mon Dossier</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Articles</h2>
            <ul className="space-y-2">
              {dossier?.articles?.map((articleId, index) => (
                <li key={index}>{articleId}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Décisions</h2>
            <ul className="space-y-2">
              {dossier?.decision?.map((decisionId, index) => (
                <li key={index}>{decisionId}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Législations</h2>
            <ul className="space-y-2">
              {dossier?.legislation?.map((legislationId, index) => (
                <li key={index}>{legislationId}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      
    </div>
  );
};

export default Dossier;
