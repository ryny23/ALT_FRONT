import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const videos = [
    { id: 1, title: 'Webinaire 1', url: 'https://www.example.com/video1' },
    { id: 2, title: 'Webinaire 2', url: 'https://www.example.com/video2' },
    { id: 3, title: 'Webinaire 3', url: 'https://www.example.com/video3' },
    { id: 4, title: 'Webinaire 4', url: 'https://www.example.com/video4' },
    { id: 5, title: 'Webinaire 5', url: 'https://www.example.com/video5' },
  ];
  
  const Webo = ({ isLoggedIn }) => {
    const [showPopup, setShowPopup] = useState(false);
    const history = useHistory();
  
    const handleClick = (video) => {
      if (!isLoggedIn && video.id > 3) {
        setShowPopup(true);
      } else {
        window.open(video.url, '_blank');
      }
    };
  
    const handleLoginRedirect = () => {
      history.push('/connexion');
    };

    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Webinaires</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map(video => (
              <div
                key={video.id}
                className={`p-4 border rounded cursor-pointer ${!isLoggedIn && video.id > 3 ? 'grayscale' : ''}`}
                onClick={() => handleClick(video)}
              >
                <h2 className="text-xl">{video.title}</h2>
              </div>
            ))}
          </div>
          {showPopup && (
            <div className="popup">
              <div className="popup-inner">
                <p>Vous devez être connecté pour voir plus de contenu.</p>
                <div className="mt-4">
                  <button className="mr-2 p-2 bg-blue-500 text-white rounded" onClick={handleLoginRedirect}>
                    Se connecter
                  </button>
                  <button className="p-2 bg-gray-500 text-white rounded" onClick={() => setShowPopup(false)}>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };
    

export default Webo