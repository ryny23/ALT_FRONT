import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Bell, Book, Briefcase, Users, Zap, Coffee, TrendingUp, Award, Settings, Medal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import anime from '../assets/anime.svg';



const Carousel = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(children.length);
  const [touchPosition, setTouchPosition] = useState(null);

  useEffect(() => {
    setLength(children.length);
  }, [children]);

  const next = useCallback(() => {
    if (currentIndex < (length - 1)) {
      setCurrentIndex(prevState => prevState + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex, length]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1);
    } else {
      setCurrentIndex(length - 1);
    }
  }, [currentIndex, length]);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [next]);

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  }

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;

    if(touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {React.Children.map(children, (child, index) => (
            <div className="w-full flex-shrink-0 flex-grow" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={prev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={next}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const DashboardCard = ({ title, icon, content, className, onClick }) => (
  <motion.div 
    className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(0,0,0,0.1)" }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-lg font-semibold ml-2 text-black dark:text-white">{title}</h3>
    </div>
    <div className="text-black dark:text-white">{content}</div>
  </motion.div>
);

const InfiniteScroll = ({ items }) => {
  const scrollRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const scrollWidth = scrollRef.current.scrollWidth;
    const animateScroll = async () => {
      await controls.start({
        x: -scrollWidth,
        transition: { duration: 70, ease: "linear" }
      });
      controls.set({ x: 0 });
      animateScroll();
    };
    animateScroll();
  }, [controls]);

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={scrollRef}
        className="flex whitespace-nowrap"
        animate={controls}
      >
        {items.concat(items).map((item, index) => (
          <div key={index} className="inline-block px-4">
            <span className="text-2xl font-bold text-blue-100 dark:text-blue-400">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const RenderAcceuil = () => {
  const [userName, setUserName] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [experts, setExperts] = useState([]);


  useEffect(() => {
    setUserName(localStorage.getItem('conUserName') || 'Utilisateur');
    const fetchData = async () => {
      try {
        const [articlesRes, expertsRes] = await Promise.all([
          axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc'),
          axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users?acf_field=expert&acf_value=true&_fields=id,slug,acf')
        ]);

        const articlesWithMedia = await Promise.all(
          articlesRes.data.map(async (article) => {
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
        setExperts(expertsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        setError('Erreur lors de la récupération des données.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading..." />
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  const alerts = [
    "Nouvelle loi sur la protection des données : Impact majeur sur les entreprises",
    "RGPD : Mise à jour cruciale des règles de conformité à venir",
    "Jurisprudence fiscale : Changement important affectant les PME",
    "Droit du travail : Nouvelles dispositions sur le télétravail",
    "Propriété intellectuelle : Évolution des droits d'auteur dans l'ère numérique"
  ];

  const activityData = [
    { name: 'Jan', users: 4000 },
    { name: 'Fév', users: 3000 },
    { name: 'Mar', users: 5000 },
    { name: 'Avr', users: 4500 },
    { name: 'Mai', users: 6000 },
    { name: 'Juin', users: 5500 },
  ];

  const ExpertRanking = ({ experts }) => {
    // Sélectionner aléatoirement 3 experts pour le podium
    const podiumExperts = shuffleArray([...experts]).slice(0, 3);
    
    // Sélectionner aléatoirement 2 experts différents pour les mentions spéciales
    const remainingExperts = experts.filter(expert => !podiumExperts.includes(expert));
    const mentionSpecialExperts = shuffleArray(remainingExperts).slice(0, 2);
  
    return (
      <div>
        <ExpertPodium experts={podiumExperts} />
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Mentions spéciales :</h4>
          <ul className="list-disc list-inside">
            {mentionSpecialExperts.map((expert, index) => (
              <li key={expert.id}>
                {index + 4}. Me. {expert.acf.nom} {expert.acf.prenom} <span className="text-yellow-400">{'★'}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/dashboard/expert" className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
          Voir tous les experts
        </Link>
      </div>
    );
  };
  

  const ExpertPodium = ({ experts }) => {
    const podiumOrder = [1, 0, 2]; // Ordre du podium : Or, Argent, Bronze
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Or, Argent, Bronze
  
    return (
      <div className="flex justify-center items-end mb-8">
        {podiumOrder.map((index, i) => {
          const expert = experts[index];
          const podiumHeight = i === 0 ? 'h-32' : i === 1 ? 'h-24' : 'h-16';
          
          return (
            <div key={expert.id} className={`flex flex-col items-center mx-2`}>
              <div className="mb-2">
                {generateAvatar(`${expert.acf.prenom} ${expert.acf.nom}`, colors[i])}
              </div>
              <div className="text-center">
                <p className="font-semibold">Me. {expert.acf.nom} {expert.acf.prenom}</p>
                <div className="text-yellow-400">{'★'.repeat(3 - i)}</div>
              </div>
              <div className={`w-20 ${podiumHeight} ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-300' : 'bg-yellow-700'} mt-2`}></div>
            </div>
          );
        })}
      </div>
    );
  };

  const generateAvatar = (name, backgroundColor) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill={backgroundColor} />
        <text x="20" y="25" fontFamily="Arial" fontSize="16" fill="white" textAnchor="middle">{initials}</text>
      </svg>
    );
  };

  const togglePreferences = () => setShowPreferences(!showPreferences);

  const handlePreferenceChange = (pref) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Bienvenue, <span className="font-bold capitalize text-green-500">{userName}</span> !
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <motion.div 
          className="md:col-span-6 bg-gradient-to-r from-black to-purple-800 rounded-xl p-6 border border-blue-200 dark:border-blue-200 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center mb-4">
            <Bell className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-bold ml-2 text-white justify-center items-center text-center">Alertes Juridiques</h3>
          </div>
          <InfiniteScroll items={alerts} />
        </motion.div>



        <DashboardCard 
          title="Bibliothèque Juridique" 
          icon={<Book className="w-6 h-6 text-green-500" />}
          content={
            <div>
              <p>Accédez à plus de 10 000 documents juridiques</p>
              <p className="mt-2">Dernière mise à jour : il y a 2 heures</p>
              <p>Documents les plus consultés :</p>
              <ul className="list-disc list-inside mt-2">
                <li>Code civil - Article 1134</li>
                <li>Loi sur la protection des données</li>
                <li>Contrat de travail type</li>
              </ul>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
                Explorer
              </button>
            </div>
          }
          onClick={() => console.log('Naviguer vers la bibliothèque juridique')}
          className="md:col-span-2"
        />

        <DashboardCard 
          title="Cas Pratiques" 
          icon={<Briefcase className="w-6 h-6 text-green-500" />}
          content={
            <div>
              <p>Analysez des cas réels pour améliorer votre expertise</p>
              <ul className="mt-2 list-disc list-inside">
                <li>Droit des contrats (15 nouveaux cas)</li>
                <li>Propriété intellectuelle (8 nouveaux cas)</li>
                <li>Droit du travail (12 nouveaux cas)</li>
              </ul>
              <p className="mt-2">Total de cas résolus : 1230</p>
              <p>Votre score : 85/100</p>
            </div>
          }
          onClick={() => console.log('Naviguer vers les cas pratiques')}
          className="md:col-span-2"
        />

        <DashboardCard 
          title="Réseau Professionnel" 
          icon={<Users className="w-6 h-6 text-green-500" />}
          content={
            <div>
              <p>Connectez-vous avec d'autres professionnels du droit</p>
              <p className="mt-2 font-semibold">15 nouvelles connexions cette semaine</p>
              <p>Votre réseau compte 342 membres</p>
              <p>5 discussions actives dans vos groupes</p>
            </div>
          }
          onClick={() => console.log('Naviguer vers le réseau professionnel')}
          className="md:col-span-2"
        />

        <div className="md:col-span-6">
          <h2 className="text-2xl font-semibold mb-6">Nouveautés. Façon ALT.</h2>
          <Carousel>
            {articles.map((article) => (
              <div key={article.id} className="px-2">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  {article.featured_media && (
                    <img 
                      src={article.featured_media.source_url} 
                      alt={article.featured_media.alt_text || article.title.rendered} 
                      className="w-full h-48 object-cover mb-4 rounded" 
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2 flex-grow">
                    <Link to={`/post/${article.id}`} className="hover:text-green-500 transition duration-300">
                      {article.title.rendered}
                    </Link>
                  </h3>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <DashboardCard 
          title="Astuces d'Utilisation" 
          icon={<Zap className="w-6 h-6 text-green-500" />}
          content={
            <ul className="space-y-2">
              <li>Utilisez les filtres avancés pour affiner vos recherches</li>
              <li>Créez des alertes personnalisées pour rester informé</li>
              <li>Exportez vos recherches en PDF pour un accès hors-ligne</li>
              <li>Astuce du jour : Utilisez la fonction "Comparer" pour analyser différentes versions d'un document</li>
            </ul>
          }
          className="md:col-span-3"
          onClick={() => console.log('Afficher plus d\'astuces')}
        />

        <DashboardCard 
          title="Pause Café Juridique" 
          icon={<Coffee className="w-6 h-6 text-green-500" />}
          content={
            <div>
              <p className="font-semibold">Le saviez-vous ?</p>
              <p className="mt-2">Le terme "jurisprudence" vient du latin "juris prudentia", qui signifie "sagesse du droit".</p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
                Plus d'anecdotes
              </button>
            </div>
          }
          className="md:col-span-3"
          onClick={() => console.log('Afficher plus d\'anecdotes juridiques')}
        />


        <DashboardCard 
          title="Top Experts du Mois" 
          icon={<Award className="w-6 h-6 text-green-500" />}
          content={<ExpertRanking experts={experts} />}
          className="md:col-span-3"
        />

        <DashboardCard 
          title="Activité des Membres" 
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          content={
            <div className="h-64">
              <LineChart width={300} height={200} data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" />
              </LineChart>
            </div>
          }
          className="md:col-span-2"
        />


      </div>
    </div>
  );
};

export default RenderAcceuil;