import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';

const Avis = () => {
  const [titreTemoignage, setTitreTemoignage] = useState('');
  const [temoignage, setTemoignage] = useState('');
  

  

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    try {
        const token = localStorage.getItem('token');

        const response = await axios.patch('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
            acf: {
                titreavis:titreTemoignage,
                
                desavis: temoignage,
                
              
            },
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Avis à jour', response.data);
        alert('avis envoyé');
    } catch (error) {
        console.error('Error updating user information:', error);
        setError('Erreur lors de la mise à jour des informations. Veuillez réessayer.');
    }
};

  return (
    <div>
      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={logo} width={200} height={100} alt="Image" className="w-full h-auto rounded-lg" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Partagez Votre Avis</h2>
              <p className="text-muted-foreground">
                Nous aimerions entendre vos retours sur nos services. Laissez un avis pour nous aider à nous améliorer.
              </p>
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div>
                  <label htmlFor="titre-temoignage" className="block text-sm font-medium text-gray-700">
                    Titre du témoignage
                  </label>
                  <input
                    type="text"
                    id="titre-temoignage"
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    placeholder="Titre du témoignage"
                    value={titreTemoignage}
                    onChange={(e) => setTitreTemoignage(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="temoignage" className="block text-sm font-medium text-gray-700">
                    Témoignage
                  </label>
                  <textarea
                    id="temoignage"
                    className="flex min-h-[80px] w-full rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Avis;
