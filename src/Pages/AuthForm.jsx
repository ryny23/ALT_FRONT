import React, { useState, useEffect } from 'react';
import wellcome from '../assets/wellcome.jpg';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const AuthForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
    const location = useLocation();
    const navigate = useNavigate();
  
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const tab = searchParams.get('tab');
      if (tab === 'register') {
        setActiveTab('register');
      } else {
        setActiveTab('login');
      }
    }, [location.search]);
  
    const handleTabClick = (tab) => {
      if (tab !== activeTab) {
        setActiveTab(tab);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSelectedProfession('');
        setError('');
      }
    };
  
    const onFormSubmit = (event) => {
      event.preventDefault();
  
      // Validation du mot de passe assouplie
      if (password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
  
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
  
      if (!termsAccepted) {
        setError('Vous devez accepter les Conditions générales d\'utilisation');
        return;
      }
  
      const siteUrl = 'https://alt.back.qilinsa.com/';
  
      const registerData = {
        username: username,
        email: email,
        password: password,
        profession: selectedProfession,
      };
  
      setLoading(true);
  
      axios.post(`${siteUrl}/wp-json/custom/v1/register`, registerData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        console.log(res.data);
        alert('Inscription réussie!');
        navigate('/authform');
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Une erreur est survenue');
        setLoading(false);
      });
    };
  
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
  
    const professions = [
      'Ingénieur', 'Médécin', 'Avocat', 'Enseignant', 'Designer',
      'Développeur', 'Architecte', 'Notaire', 'Journaliste', 'Psychologue',
      'Pilote', 'Infirmier', 'Entrepreneur', 'Scientifique'
    ];
  
    const [conState, setConState] = useState({
      conUsername: '',
      conPassword: '',
      conUserNiceName: '',
      conUserEmail: '',
      conLoggedIn: false,
      conLoading: false,
      conError: '',
      conRememberMe: false
    });
  
    const onFormSubmitCon = (event) => {
      event.preventDefault();
  
      const siteUrl = 'https://alt.back.qilinsa.com/';
  
      const loginData = {
        username: conState.conUsername,
        password: conState.conPassword,
      };
  
      setConState({ ...conState, conLoading: true });
  
      axios.post(`${siteUrl}/wp-json/jwt-auth/v1/token`, loginData)
        .then(res => {
          if (undefined === res.data.token) {
            setConState({ ...conState, conError: 'Identifiants invalides', conLoading: false });
            return;
          }
          
          if (conState.conRememberMe) {
            Cookies.set('token', res.data.token, { expires: 2 });
            Cookies.set('conUserName', res.data.user_nicename, { expires: 2 });
          } else {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('conUserName', res.data.user_nicename);
            localStorage.setItem('conUserEmail', res.data.user_email);
          }
  
          setConState({
            ...conState,
            conLoading: false,
            token: res.data.token,
            conUserNiceName: res.data.user_nicename,
            conUserEmail: res.data.user_email,
            conLoggedIn: true,
            conError: ''
          });
  
          navigate('/dashboard');
        })
        .catch(err => {
          setConState({ ...conState, conError: 'Identifiants invalides', conLoading: false });
        });
    };

    
  
    const handleOnChangeCon = (event) => {
      const { name, value, type, checked } = event.target;
      setConState({
        ...conState,
        [name]: type === 'checkbox' ? checked : value
      });
    };
  
    const { conUsername, conPassword, conLoggedIn, conError, conRememberMe } = conState;
  
    // if (conLoggedIn || localStorage.getItem('token') || Cookies.get('token')) {
    //   navigate('/authform');
    //   return null;
    // }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Formulaires (côté gauche sur grands écrans) */}
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col relative overflow-hidden">
        {/* Tabs de navigation */}
        <div className="flex justify-center p-4">
          <div className="flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => handleTabClick('login')}
              className={`px-4 py-2 text-lg font-medium rounded-l-lg transition duration-150 ease-in-out ${
                activeTab === 'login'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-opacity-50'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('register')}
              className={`px-4 py-2 text-lg font-medium rounded-r-lg transition duration-150 ease-in-out ${
                activeTab === 'register'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-opacity-50'
              }`}
            >
              Inscription
            </button>
          </div>
        </div>

        {/* Conteneur des formulaires avec effet de transition */}
        <div className="flex-1 flex transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(${activeTab === 'register' ? '-100%' : '0'})` }}>
          {/* Formulaire de connexion */}
          <div className="w-full flex-shrink-0 p-8">
            <h2 className="text-3xl mb-6 text-center font-bold text-gray-900">Connexion</h2>
            {conError && <div className="text-red-500 mb-4">{conError}</div>}
            <form onSubmit={onFormSubmitCon} className="space-y-4">
              <div>
                <label htmlFor="conUsername" className="block text-sm font-medium text-gray-700">Nom d'utilisateur ou Email</label>
                <input
                  type="text"
                  name="conUsername"
                  id="conUsername"
                  value={conUsername}
                  onChange={handleOnChangeCon}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="relative">
                <label htmlFor="conPassword" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="conPassword"
                  id="conPassword"
                  value={conPassword}
                  onChange={handleOnChangeCon}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff className="mt-6 h-5 w-5 text-gray-500" /> : <Eye className="mt-6 h-5 w-5 text-gray-500" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="conRememberMe"
                    type="checkbox"
                    checked={conRememberMe}
                    onChange={handleOnChangeCon}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgotpassword" className="font-medium text-green-600 hover:text-green-500">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Se connecter
                </button>
              </div>
            </form>
          </div>

          {/* Formulaire d'inscription */}
          <div className="w-full flex-shrink-0 p-8">
            <h2 className="text-3xl mb-6 text-center font-bold text-gray-900">Inscription</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={onFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleOnChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff className="mt-6 h-5 w-5 text-gray-500" /> : <Eye className="mt-6 h-5 w-5 text-gray-500" />}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? <EyeOff className="mt-6 h-5 w-5 text-gray-500" /> : <Eye className="mt-6 h-5 w-5 text-gray-500" />}
                </button>
              </div>
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession ou métier</label>
                <select
                  id="profession"
                  name="profession"
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner une profession</option>
                  {professions.map((profession, index) => (
                    <option key={index} value={profession}>{profession}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="terms" className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    onChange={handleOnChange}
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    J'accepte les <Link to="/conditions-generales" className="text-green-600 hover:underline">termes et conditions générales</Link>
                  </span>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  S'inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image (côté droit sur grands écrans) */}
      <div className="hidden md:block w-1/2 h-full">
        <img src={wellcome} className="w-full h-full object-cover" alt="Welcome" />
      </div>
    </div>
  );
};

export default AuthForm;