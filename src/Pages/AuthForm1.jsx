import React, { useState } from 'react';
import wellcome from '../assets/wellcome.jpg';
import axios from 'axios';



const AuthForm1 = () => {
    
    
    
    const [username, setUsername] = useState(''); // Nom d'utilisateur
  const [email, setEmail] = useState(''); // Adresse email
  const [password, setPassword] = useState(''); // Mot de passe
  const [confirmPassword, setConfirmPassword] = useState(''); // Mot de passe de confirmation
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(''); // Message d'erreur
  const [termsAccepted, setTermsAccepted] = useState(false); // Indicateur de l'acceptation des termes
  const [activeTab, setActiveTab] = useState('login');
  
  


  // Fonction appelée lors de la soumission du formulaire d'inscription
  const onFormSubmit = (event) => {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

    // Expression régulière pour valider le mot de passe
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+-/])[A-Za-z\d@$!%*?&+-/]{8,}$/;

    // Vérification si les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Vérification de la validité du mot de passe
    if (!passwordRegex.test(password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, incluant une lettre, un chiffre et un caractère spécial');
      return;
    }

    // Vérification de l'acceptation des termes
    if (!termsAccepted) {
      setError('Vous devez accepter les Conditions générales d\'utilisation');
      return;
    }

    const siteUrl = 'http://localhost/alt2'; // URL de l'API

    // Données d'inscription à envoyer à l'API
    const registerData = {
      username: username,
      email: email,
      password: password,
    };

    // Mise à jour de l'état pour afficher le chargement
    setLoading(true);

    // Envoi de la requête POST à l'API d'inscription avec Axios
    axios.post(`${siteUrl}/wp-json/custom/v1/register`, registerData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        // Gestion de la réponse de l'API
        console.log(res.data);
        // Redirection programmative vers la page de connexion après inscription réussie
        window.location.href = "/authform";
      })
      .catch(err => {
        // Gestion des erreurs
        setError(err.response.data.message);
        setLoading(false);
      });
  };

  // Fonction appelée lorsqu'un champ de saisie est modifié
  const handleOnChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setTermsAccepted(checked);
    } else {
      if (name === 'username') setUsername(value);
      if (name === 'email') setEmail(value);
      if (name === 'password') setPassword(value);
      if (name === 'confirmPassword') setConfirmPassword(value);
    }
  };
    
    const [selectedProfession, setSelectedProfession] = useState('');
    

    const professions = [
        'Ingénieur',
        'Docteur',
        'Avocat',
        'Enseignant',
        'Designer',
        'Développeur',
        'Architecte',
        'Artiste',
        'Journaliste',
        'Psychologue',
        'Pilote',
        'Infirmier',
        'Entrepreneur',
        'Scientifique',
        'Étudiant'
    ];


    const handleTabClick = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            // Réinitialiser les champs et les erreurs si nécessaire
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            
            
            setSelectedProfession('');
            
        }
    };




   // Initialisation de l'état du composant avec useState
  const [conState, setConState] = useState({
    conUsername: '',
    conPassword: '',
    conUserNiceName: '',
    conUserEmail: '',
    conLoggedIn: false,
    conLoading: false,
    conError: '',
    conRememberMe: false // Ajouter une propriété pour l'option "Se souvenir de moi"
  });

  // Fonction appelée lors de la soumission du formulaire de connexion
  const onFormSubmitCon = (event) => {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

    const siteUrl = 'http://localhost/alt2'; // URL de l'API

    // Données de connexion à envoyer à l'API
    const loginData = {
      username: conState.conUsername,
      password: conState.conPassword,
    };

    // Mise à jour de l'état pour afficher le chargement
    setConState({ ...conState, conLoading: true });

    // Envoi de la requête POST à l'API d'authentification avec Axios
    axios.post(`${siteUrl}/wp-json/jwt-auth/v1/token`, loginData)
      .then(res => {
        // Gestion de la réponse de l'API
        if (undefined === res.data.token) {
          setConState({ ...conState, conError: 'Identifiants invalid', conLoading: false });
          return;
        }
        
        // Stockage du token et des informations de l'utilisateur
        if (conState.conRememberMe) {
          Cookies.set('token', res.data.token, { expires: 2 });
          Cookies.set('conUserName', res.data.user_nicename, { expires: 2 });
        } else {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('conUserName', res.data.user_nicename);
        }

        // Mise à jour de l'état pour indiquer que l'utilisateur est connecté
        setConState({
          ...conState,
          conLoading: false,
          token: res.data.token,
          conUserNiceName: res.data.user_nicename,
          conUserEmail: res.data.user_email,
          conLoggedIn: true,
          conError: '' // Réinitialiser l'erreur
        });

        // Redirection programmative vers le tableau de bord
        window.location.href = "/dashboard";
      })
      .catch(err => {
        // Gestion des erreurs
        setConState({ ...conState, conError: 'Identifiants invalid', conLoading: false });
      });
  };

  // Fonction appelée lorsqu'un champ de saisie est modifié
  const handleOnChangeCon = (event) => {
    const { name, value, type, checked } = event.target;
    setConState({
      ...conState,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const { conUsername, conPassword, conLoggedIn, conError, conRememberMe } = conState;


    
    return (
        <div className="w-full h-screen flex items-start">
            {/* Contenu du formulaire */}
            <div className={`w-1/2 h-full bg-[white] flex flex-col p-20 justify-items-start transition-transform duration-700 transform ${activeTab === 'register' ? 'translate-x-full' : 'translate-x-0'}`}>
                <div className="flex justify-center mb-6">
                    <div
                        className={`cursor-pointer py-2 px-4 text-lg font-medium transition-transform ${activeTab === 'login' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-green-600'} px-4 py-2 rounded-l-md focus:outline-none`}
                        onClick={() => handleTabClick('login')}
                    >
                        Connexion
                    </div>
                    <div
                        className={`cursor-pointer py-2 px-4 text-lg font-medium ${activeTab === 'register' ? 'text-white border-[1px] bg-green-600' : 'hover:bg-gray-200 text-gray-500'} px-4 py-2 rounded-r-md focus:outline-none`}
                        onClick={() => handleTabClick('register')}
                    >
                        Inscription
                    </div>
                </div>
                {error && <div className="text-red-500">{error}</div>} {/* Afficher l'erreur ici */}
                <h2 className="text-3xl pb-8 text-center font-extrabold text-gray-900">{activeTab === 'login' ? 'Connexion' : 'Inscription'}</h2>
                <a href="/"><p className='text-green-600 text-end font-medium text-sm hover:underline focus:outline-none object-cover'>Retournez à la page d'acceuil</p></a>
                
                    {activeTab === 'register' && (
                        <form  onSubmit={onFormSubmit} className="w-full">
                            <div className='h-full justify-between'>

                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username} onChange={handleOnChange}
                                    required
                                    className={`appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm `}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email} onChange={handleOnChange}
                                    required
                                    className={`appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm `}
                                />
                                
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password} onChange={handleOnChange}
                                    required
                                    className={`appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm `}
                                />
                                
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword} onChange={handleOnChange}
                                    required
                                    className={`appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm `}
                                />
                                
                            </div>
                            {/* <div className="mb-4">
                                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession ou métier</label>
                                <select
                                    id="profession"
                                    name="profession"
                                    value={selectedProfession}
                                    onChange={(e) => setSelectedProfession(e.target.value)}
                                    required
                                    className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner une profession</option>
                                    {professions.map((profession, index) => (
                                        <option key={index} value={profession}>{profession}</option>
                                    ))}
                                </select>
                            </div> */}
                            <div className="mb-6">
                                <label htmlFor="terms" className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        name="terms" onChange={handleOnChange}
                                        
                                        
                                        className="rounded border-gray-400 text-green-500 shadow-sm focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        J'accepte les <a href="#" className="text-green-600 hover:underline">termes et conditions générales</a>
                                    </span>
                                </label>
                            </div>
                            </div>
                            <div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4  rounded-md hover:bg-green-900 transition duration-200">
                            {activeTab === 'login' ? 'Se connecter' : 'S\'inscrire'}
                        </button>
                        
                    </div>
                        </form>
                        
                    )}
                    {activeTab === 'login' && (
                        <form  onSubmit={onFormSubmitCon} className="w-full">
                            <div className=' h-full justify-items-stretch'>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur ou Email</label>
                                    <input
                                        type="text" name="conUsername" id="email" value={conUsername} onChange={handleOnChangeCon}
                                        required
                                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                    <input
                                        type="password"
                                        
                                        name="conPassword" id="password" value={conPassword} onChange={handleOnChangeCon}
                                        required
                                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                    
                                    <div className="flex items-center justify-between mt-2">
                                        
                                        <div className="text-sm">
                                    
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Logique pour afficher une modal ou une nouvelle vue pour la récupération de mot de passe
                                                    console.log('Mot de passe oublié');
                                                }}
                                                className="text-red-600 hover:underline focus:outline-none object-cover"
                                            >
                                                Mot de passe oublié ?
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4  rounded-md hover:bg-green-900 transition duration-200">
                            {activeTab === 'login' ? 'Se connecter' : 'S\'inscrire'}
                        </button>
                        
                    </div>
                        </form>
                        
                    )}
                    
            </div>

            {/* Image */}
            <div className={`relative w-1/2 h-full flex flex-col transition-transform duration-700 transform ${activeTab === 'register' ? '-translate-x-full' : 'translate-x-0'}`}>
                <img src={wellcome} className='w-full h-full object-cover' />
            </div>
        </div>
    );
};

export default AuthForm1;