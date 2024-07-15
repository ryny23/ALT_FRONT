import React, { useState } from 'react';

const AuthForm = () => {
  const [activeForm, setActiveForm] = useState('login');

  const handleFormSwitch = (form) => {
    setActiveForm(form);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-blue-500 flex items-center justify-center">
        {activeForm === 'login' ? (
          <div className="text-white text-2xl">
            <h2 className="mb-4">Connexion</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2">Nom d'utilisateur</label>
                <input type="text" id="username" className="p-2 rounded bg-blue-300 text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Mot de passe</label>
                <input type="password" id="password" className="p-2 rounded bg-blue-300 text-black" />
              </div>
              <button type="submit" className="p-2 bg-blue-700 rounded">Se connecter</button>
            </form>
            <button
              onClick={() => handleFormSwitch('register')}
              className="mt-4 p-2 bg-white text-blue-700 rounded"
            >
              Créer un compte
            </button>
          </div>
        ) : (
          <div className="text-white text-2xl">
            <button
              onClick={() => handleFormSwitch('login')}
              className="p-2 bg-white text-blue-700 rounded"
            >
              Se connecter
            </button>
          </div>
        )}
      </div>
      <div className="w-1/2 bg-green-500 flex items-center justify-center">
        {activeForm === 'register' ? (
          <div className="text-white text-2xl">
            <h2 className="mb-4">Inscription</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2">Nom d'utilisateur</label>
                <input type="text" id="username" className="p-2 rounded bg-green-300 text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input type="email" id="email" className="p-2 rounded bg-green-300 text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Mot de passe</label>
                <input type="password" id="password" className="p-2 rounded bg-green-300 text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block mb-2">Confirmer le mot de passe</label>
                <input type="password" id="confirmPassword" className="p-2 rounded bg-green-300 text-black" />
              </div>
              <button type="submit" className="p-2 bg-green-700 rounded">S'inscrire</button>
            </form>
            <button
              onClick={() => handleFormSwitch('login')}
              className="mt-4 p-2 bg-white text-green-700 rounded"
            >
              Se connecter
            </button>
          </div>
        ) : (
          <div className="text-white text-2xl">
            <button
              onClick={() => handleFormSwitch('register')}
              className="p-2 bg-white text-green-700 rounded"
            >
              Créer un compte
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
