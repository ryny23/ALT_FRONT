import React, { useState } from 'react';
import axios from 'axios';
import test from '../assets/test.png';

const Avis = () => {
  const [titreTemoignage, setTitreTemoignage] = useState('');
  const [temoignage, setTemoignage] = useState('');
  const [error, setError] = useState('');

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }
      const nom = localStorage.getItem('conUserName');
      const response = await axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/avis', {
        title: titreTemoignage ,
        content: temoignage,
        acf: { nom: nom },
        status: 'pending',
        
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(nom);
      console.log('Avis submitted', response.data);
      alert('Avis envoyé');
    } catch (error) {
      console.error('Error submitting avis:', error);
      if (error.response && error.response.status === 403) {
        setError('Permission denied. Please check your user role and permissions.');
      } else {
        setError('Erreur lors de la soumission de l\'avis. Veuillez réessayer.');
      }
    }
  };

  return (
    <div>
      <section className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  px-10 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <img src={test} alt="avis client" className="w-screen h-auto rounded-3xl" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Partagez Votre Avis</h2>
              <p className="text-muted-foreground">
                Nous aimerions entendre vos retours sur nos services. Laissez un avis pour nous aider à nous améliorer.
              </p>
              <form onSubmit={handleSaveChanges} className="justify-stretch items-center space-y-4">
                <div className='space-y-2'>
                  <label htmlFor="titre-temoignage" className="block text-sm font-medium bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                    Titre du témoignage
                  </label>
                  <input
                    type="text"
                    id="titre-temoignage"
                    className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    placeholder="Titre du témoignage"
                    value={titreTemoignage}
                    onChange={(e) => setTitreTemoignage(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor="temoignage" className="block text-sm font-medium bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                    Témoignage
                  </label>
                  <textarea
                    id="temoignage"
                    className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text flex min-h-[80px] w-full rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    rows="4"
                    placeholder="Votre témoignage"
                    value={temoignage}
                    onChange={(e) => setTemoignage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-gray-600">
                  Soumettre
                </button>
              </form>
              {error && <p className="text-red-600">{error}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Avis;
