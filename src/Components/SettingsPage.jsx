import React, { useState, useEffect } from 'react';
import axios from 'axios';
import anime from '../assets/anime.svg'

const SimpleToggle = ({ isEnabled, setIsEnabled }) => (
  <button
    onClick={() => setIsEnabled(!isEnabled)}
    className={`${
      isEnabled ? 'bg-blue-600' : 'bg-gray-200'
    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
  >
    <span className="sr-only">Toggle Theme</span>
    <span
      className={`${
        isEnabled ? 'translate-x-6' : 'translate-x-1'
      } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
    />
  </button>
);

const SettingsPage = () => {
  const [theme, setTheme] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [state, setState] = useState({
    loading: true,
    error: ''
  });

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Fetch user data from the WordPress API
    axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Assumes token is stored in localStorage
      }
    })
    .then(response => {
      const userData = response.data;
      if (userData.acf) {
        if (userData.acf.preferences) {
          setSelectedDomains(userData.acf.preferences);
        }
        if (userData.acf.notifemail !== undefined) {
          setNotifications(userData.acf.notifemail);
        }
        if (userData.acf.theme !== undefined) {
          setTheme(userData.acf.theme);
        }
      }
      setState({ loading: false, error: '' });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, []);

  const legalDomains = [
    'Droit des affaires',
    'Droit social',
    'Droit pénal',
    'Droit civil',
    'Droit administratif',
    'Droit fiscal',
    'Droit international',
    'Droit de l’environnement',
    'Droit immobilier',
  ];

  const toggleDomain = (domain) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleSave = () => {
    // Save user preferences to the WordPress API
    axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
      acf: {
        preferences: selectedDomains,
        notifemail: notifications,
        theme: theme,
      }
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Assumes token is stored in localStorage
      }
    })
    .then(response => {
      console.log('Preferences saved successfully:', response.data);
      setSaveMessage('Sauvegarde effectuée avec succès!');
      setTimeout(() => setSaveMessage(''), 3000); // Hide message after 3 seconds
    })
    .catch(error => {
      console.error('Error saving preferences:', error);
      setSaveMessage('Erreur lors de la sauvegarde.');
      setTimeout(() => setSaveMessage(''), 3000); // Hide message after 3 seconds
    });
  };

  const { loading, error } = state;

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

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-8">
      <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Paramètres</h1>

      {/* Affichage et Accessibilité */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-4">Affichage et Accessibilité</h2>
        <div className="flex items-center space-x-4">
          <span className="text-light-text dark:text-dark-text">Thème:</span>
          <SimpleToggle isEnabled={theme} setIsEnabled={setTheme} />
        </div>
      </section>

      {/* Préférences de Veille Juridique */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-4">Préférences de Veille Juridique</h2>
        <div className="grid grid-cols-3 gap-4">
          {legalDomains.map((domain) => (
            <div
              key={domain}
              className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 
                ${selectedDomains.includes(domain) ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} 
                dark:bg-gray-700 dark:text-gray-200`}
              onClick={() => toggleDomain(domain)}
            >
              {domain}
            </div>
          ))}
        </div>
      </section>

      {/* Préférences de Notification */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-4">Préférences de Notification</h2>
        <label className="flex items-center space-x-4">
          <span className="text-light-text dark:text-dark-text">Recevoir des notifications par email:</span>
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6 text-blue-600"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </label>
      </section>

      {/* Bouton de Sauvegarde */}
      <button 
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Sauvegarder
      </button>

      {/* Message de Sauvegarde */}
      {saveMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;