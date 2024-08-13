import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import parse from 'html-react-parser'; // Assurez-vous que vous avez installé cette dépendance
import anime from '../assets/anime.svg'; // Assurez-vous que vous avez un spinner de chargement approprié

const Commentaires = () => {
  const [Commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommentaires = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires');
        setCommentaires(res.data);
      } catch (err) {
        setError('Failed to fetch Commentaires');
      } finally {
        setLoading(false);
      }
    };

    fetchCommentaires();
  }, []);

  return (
    <div>
      <div className="mr-6 lg:w-[1200px] mt-8 py-2 flex-shrink-0 flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-lg">
        <h3 className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-white">
          <span>Commentaires</span>
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
              {Commentaires.map((commentaire) => (
            <li key={commentaire.id} className="mt-2">
              <NavLink to={`${commentaire.id}`} className="pt-5 flex flex-col justify-between  dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between font-semibold capitalize dark:text-gray-100">
                  <span>{commentaire.title?.rendered || 'No Title'}</span>
                </div>
                </NavLink>
                {commentaire.acf.url && (
                <a href={commentaire.acf.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {commentaire.acf.url}
                </a>
              )}
                <div className="text-sm font-medium leading-snug dark:text-gray-400 my-3">
                  {parse(commentaire.excerpt?.rendered) || 'No Excerpt'}
                </div>
                {/* <div className="flex justify-between">
                  <p className="text-sm font-medium leading-snug text-gray-600">{commentaire.date ? new Date(commentaire.date).toLocaleDateString() : 'No Date'}</p>
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

export default Commentaires;