import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Bell, Book, Briefcase, Users, Zap, Coffee, TrendingUp, Award } from 'lucide-react';
import anime from '../assets/anime.svg';

const DashboardCard = ({ title, icon, content }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-lg font-semibold ml-2 text-black dark:text-white">{title}</h3>
    </div>
    <div className="text-black dark:text-white">{content}</div>
  </div>
);

const RenderAcceuil = () => {
  const [userName, setUserName] = useState('Utilisateur');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/posts?per_page=5&orderby=date&order=desc');
        setArticles(articlesRes.data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
        setLoading(false);
      }
    };

    setUserName(localStorage.getItem('conUserName') || 'Utilisateur');
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><img src={anime} alt="Loading..." /></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Bienvenue, <span className="font-bold capitalize text-green-500">{userName}</span> !</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Alertes Juridiques" 
          icon={<Bell className="w-6 h-6 text-green-500" />}
          content={<p>Nouvelles alertes importantes disponibles</p>}
        />

        <DashboardCard 
          title="Bibliothèque Juridique" 
          icon={<Book className="w-6 h-6 text-green-500" />}
          content={<p>Accédez à plus de 10 000 documents juridiques</p>}
        />

        <DashboardCard 
          title="Cas Pratiques" 
          icon={<Briefcase className="w-6 h-6 text-green-500" />}
          content={<p>Analysez des cas réels pour améliorer votre expertise</p>}
        />

        <DashboardCard 
          title="Réseau Professionnel" 
          icon={<Users className="w-6 h-6 text-green-500" />}
          content={<p>Connectez-vous avec d'autres professionnels du droit</p>}
        />

        <DashboardCard 
          title="Astuces d'Utilisation" 
          icon={<Zap className="w-6 h-6 text-green-500" />}
          content={<p>Découvrez comment utiliser efficacement la plateforme</p>}
        />

        <DashboardCard 
          title="Pause Café Juridique" 
          icon={<Coffee className="w-6 h-6 text-green-500" />}
          content={<p>Le saviez-vous ? Découvrez des anecdotes juridiques</p>}
        />
      </div>

      <h2 className="text-2xl font-semibold my-6">Nouveautés. Façon ALT.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">
              <Link to={`/post/${article.id}`} className="hover:text-green-500 transition duration-300">
                {article.title.rendered}
              </Link>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderAcceuil;