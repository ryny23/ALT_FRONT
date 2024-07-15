import React, { useState, useEffect } from 'react';

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
  const [theme, setTheme] = useState('light');
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-8">
      <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Paramètres</h1>

      {/* Affichage et Accessibilité */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-4">Affichage et Accessibilité</h2>
        <div className="flex items-center space-x-4">
          <span className="text-light-text dark:text-dark-text">Thème:</span>
          <SimpleToggle isEnabled={theme === 'dark'} setIsEnabled={(enabled) => setTheme(enabled ? 'dark' : 'light')} />
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
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
        Sauvegarder
      </button>
    </div>
  );
};

export default SettingsPage;
