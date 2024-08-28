import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import axios from 'axios';

const DashboardLayout = () => {
  const [legislations, setLegislations] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [articles, setArticles] = useState([]);
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('all'); // par défaut, tous les résultats
  const [resultCounts, setResultCounts] = useState({});

  const handleResultsUpdate = (counts) => {
    setResultCounts(counts);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [legis, decis, arts, comms] = await Promise.all([
          axios.get('/api/legislations'),
          axios.get('/api/decisions'),
          axios.get('/api/articles'),
          axios.get('/api/commentaires')
        ]);
        
        setLegislations(legis.data || []); // Assurez-vous que 'data' est un tableau
        setDecisions(decis.data || []);
        setArticles(arts.data || []);
        setCommentaires(comms.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text'>
      <Dashboard resultCounts={resultCounts} />
      {/* <div className='xl:pl-64 xl:pt-[72px]'>
        <main>
          <Outlet context={{ legislations, decisions, articles, commentaires }} />
        </main>
      </div> */}
    </div>
  );
};

export default DashboardLayout;
