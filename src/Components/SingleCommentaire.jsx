import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import Nav from './Nav';
import Footer from './Footer';
import anime from '../assets/anime.svg'

const SingleCommentaire = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentaire, setCommentaire] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [titreTitle, setTitreTitle] = useState('');
  const [legislationTitle, setLegislationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const titreDataRef = useRef(null); // Ref to store titreData

  useEffect(() => {
    const fetchcommentaire = async () => {
      try {
        const altUrl = 'https://alt.back.qilinsa.com';

        // Fetch commentaire details
        const commentaireResponse = await axios.get(`${altUrl}/wp-json/wp/v2/commentaires/${id}`);
        const commentaireData = commentaireResponse.data;

        

        setCommentaire(commentaireData);
        
        setLoading(false);

        
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchcommentaire();
  }, [id]);

 

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
  if (!commentaire) return <div>No commentaire found</div>;

  return (
    <div>
      <div className="pl-8 py-8 max-w-screen-xl mx-auto bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
        <main className="mt-10 flex">
          <div className="w-2/3 pr-4  leading-relaxed">
            <h1 className="text-2xl font-semibold mb-4 mt-4">{commentaire.title.rendered}</h1>
            
            
            <div className="dark:text-gray-300 pb-6">{parse(commentaire.content.rendered)}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SingleCommentaire;
