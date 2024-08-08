import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Spinner } from "@material-tailwind/react";
import anime from '../assets/anime.svg'

const RenderAcceuil = () => {


  const userName = localStorage.getItem('conUserName');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/posts?per_page=4&orderby=date&order=desc');
        const articles = res.data;

        const articlesWithMedia = await Promise.all(
          articles.map(async (article) => {
            if (article.featured_media) {
              try {
                const mediaRes = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/media/${article.featured_media}`);
                return { ...article, featured_media: mediaRes.data };
              } catch (mediaError) {
                return { ...article, featured_media: null };
              }
            }
            return { ...article, featured_media: null };
          })
        );

        setArticles(articlesWithMedia);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors de la récupération des articles.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
      //     <span className="visually-hidden">Loading...</span>
      //   </div>
      // </div>
      <div className="flex justify-center items-center h-screen">
      
        <img src={anime}></img>
      
    </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <div>
      <section className='bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text '>
        <div className='bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text '>
        <h2 className="text-2xl font-semibold mb-4">Bienvenue <span className='font-bold text-3xl text-green-700'>{userName}<span>,</span></span></h2>
        </div>
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  p-4 rounded mb-6">
          <h3 className="text-lg font-semibold mb-2">Une question sur une entreprise ?</h3>
          <p className="mb-4">
            Posez votre question comme vous le feriez à un confrère ou à un collègue. Vous ne perdrez plus dans les documents d'entreprise. 
            Notre IA vous fournit des réponses exhaustives et sourcées directement des documents et statuts d'une entreprise.
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/80">Découvrir un exemple</button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Nouveautés. Façon ALT.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-card p-4 rounded flex flex-col items-start">
              {article.featured_media && (
                <img 
                  src={article.featured_media.source_url} 
                  alt={article.featured_media.alt_text || article.title.rendered} 
                  className="w-20 h-20 mb-4" 
                />
              )}
              <h3 className="text-lg font-semibold mb-2">
                <Link to={`/post/${article.id}`}>{article.title.rendered}</Link>
              </h3>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Fonctionnalités</h2>
        <div className="bg-card p-4 rounded">
          <p>Les fonctionnalités...</p>
        </div>
      </section>
    </div>
  );
};

export default RenderAcceuil;
