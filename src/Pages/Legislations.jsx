import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser'; // Assurez-vous que vous avez installé cette dépendance
import anime from '../assets/anime.svg'; // Assurez-vous que vous avez un spinner de chargement approprié

const Legislations = () => {
  const [Legislations, setLegislations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLegislations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/Legislations');
        setLegislations(res.data);
      } catch (err) {
        setError('Failed to fetch Legislations');
      } finally {
        setLoading(false);
      }
    };

    fetchLegislations();
  }, []);

  return (
    <div>
      <div className="mr-6 lg:w-[1200px] mt-8 py-2 flex-shrink-0 flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-textrounded-lg">
        <h3 className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-white">
          <span>Legislations</span>
          <button className="ml-2">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 256 512">
              <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
            </svg>
          </button>
        </h3>
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <img src={anime} alt="Loading" />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <ul className="pt-1 pb-2 px-3 overflow-y-auto">
              {Legislations.map((legislation) => (
                <li key={legislation.id} className="mt-2">
                  <Link to={`${legislation.id}`} className="pt-5 flex flex-col justify-between dark:bg-gray-800rounded-lg">
                    <div className="flex items-center justify-between font-semibold capitalize dark:text-white">
                      <span>{legislation.title?.rendered || 'No Title'}</span>
                    </div>
                  </Link>
                  {/* <div className="text-sm font-medium leading-snug dark:text-white dark:bg-slate-700 rounded-lg p-3 my-3">
                    {parse(legislation.excerpt?.rendered || 'No Excerpt')}
                  </div> */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Legislations;
