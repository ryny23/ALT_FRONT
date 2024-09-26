import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Bell, Book, Briefcase, Users, Zap, Coffee, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import anime from '../assets/anime.svg';

const DashboardCard = ({ title, icon, content, className }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-lg font-semibold ml-2 text-black dark:text-white">{title}</h3>
    </div>
    <div className="text-black dark:text-white">{content}</div>
  </div>
);

const ManualCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {items.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0 px-2">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                {item.featured_media && (
                  <img 
                    src={item.featured_media.source_url} 
                    alt={item.title.rendered} 
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">
                  <Link to={`/post/${item.id}`} className="hover:text-green-500 transition duration-300">
                    {item.title.rendered}
                  </Link>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={goToPrevious}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-10 -ml-4"
        aria-label="Article précédent"
      >
        <ChevronLeft className="w-6 h-6 text-green-500" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-10 -mr-4"
        aria-label="Article suivant"
      >
        <ChevronRight className="w-6 h-6 text-green-500" />
      </button>
    </div>
  );
};

const ExpertRanking = ({ experts }) => (
  <div>
    <h4 className="font-semibold mb-2">Top Experts :</h4>
    <ul className="list-disc list-inside">
      {experts.slice(0, 3).map((expert, index) => (
        <li key={expert.id}>
          {index + 1}. Me. {expert.acf.nom} {expert.acf.prenom} <span className="text-yellow-400">{'★'.repeat(3 - index)}</span>
        </li>
      ))}
    </ul>
    <Link to="/dashboard/expert" className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
      Voir tous les experts
    </Link>
  </div>
);

const RenderAcceuil = () => {
  const [userName, setUserName] = useState('Utilisateur');
  const [articles, setArticles] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, expertsRes] = await Promise.all([
          axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/posts?per_page=5&orderby=date&order=desc&_embed'),
          axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users?acf_field=expert&acf_value=true&_fields=id,slug,acf&per_page=3')
        ]);
        
        const articlesWithMedia = articlesRes.data.map(article => ({
          ...article,
          featured_media: article._embedded?.['wp:featuredmedia']?.[0]
        }));
        
        setArticles(articlesWithMedia);
        setExperts(expertsRes.data);
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

  const alerts = [
    "Nouvelle loi sur la protection des données : Impact majeur sur les entreprises",
    "RGPD : Mise à jour cruciale des règles de conformité à venir",
    "Jurisprudence fiscale : Changement important affectant les PME"
  ];

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Bienvenue, <span className="font-bold capitalize text-green-500">{userName}</span> !</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <DashboardCard 
          title="Alertes Juridiques" 
          icon={<Bell className="w-6 h-6 text-green-500" />}
          content={
            <ul className="list-disc list-inside">
              {alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          }
          className="md:col-span-6"
        />

        <DashboardCard 
          title="Bibliothèque Juridique" 
          icon={<Book className="w-6 h-6 text-green-500" />}
          content={<p>Accédez à plus de 10 000 documents juridiques</p>}
          className="md:col-span-2"
        />

        <DashboardCard 
          title="Cas Pratiques" 
          icon={<Briefcase className="w-6 h-6 text-green-500" />}
          content={<p>Analysez des cas réels pour améliorer votre expertise</p>}
          className="md:col-span-2"
        />

        <DashboardCard 
          title="Réseau Professionnel" 
          icon={<Users className="w-6 h-6 text-green-500" />}
          content={<p>Connectez-vous avec d'autres professionnels du droit</p>}
          className="md:col-span-2"
        />

        <div className="md:col-span-6">
          <h2 className="text-2xl font-semibold mb-6">Nouveautés. Façon ALT.</h2>
          <ManualCarousel items={articles} />
        </div>

        <DashboardCard 
          title="Astuces d'Utilisation" 
          icon={<Zap className="w-6 h-6 text-green-500" />}
          content={<p>Découvrez comment utiliser efficacement la plateforme</p>}
          className="md:col-span-3"
        />

        <DashboardCard 
          title="Pause Café Juridique" 
          icon={<Coffee className="w-6 h-6 text-green-500" />}
          content={<p>Le saviez-vous ? Découvrez des anecdotes juridiques</p>}
          className="md:col-span-3"
        />

        <DashboardCard 
          title="Top Experts du Mois" 
          icon={<Award className="w-6 h-6 text-green-500" />}
          content={<ExpertRanking experts={experts} />}
          className="md:col-span-6"
        />
      </div>
    </div>
  );
};

export default RenderAcceuil;