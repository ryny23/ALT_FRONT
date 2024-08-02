import React, { useState } from 'react';
import axios from 'axios';
import logo from './../assets/logo.png';
import { useNavigate } from 'react-router-dom';


const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('https://alt.back.qilinsa.com/wp-json/bdpwr/v1/set-password', {
        email: email,
        code: code,
        password: password
      });

      if (response.data.data.status === 200) {
        alert('Mot de passe reinitialisé avec succes!.');
        
        
        navigate('/authform');  // Rediriger vers la page de reset après 3 secondes
        
        
      } else {
        setError('Erreur lors de l\'envoi de l\'e-mail. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'e-mail. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-[80px] mx-auto md:h-screen lg:py-0">
          <a href="/" className="flex flex-col items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="rounded-full w-[150px] h-[150px] mr-2" src={logo} alt="logo" />
            African Legal Tech
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Réinitialiser le mot de passe
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">code</label>
                  <input
                    type="password"
                    name="code"
                    id="code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Entrez le code envoyé par mail"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Réinitialiser</button>
                {message && <p className="text-sm font-light text-green-500 dark:text-green-400">{message}</p>}
                {error && <p className="text-sm font-light text-red-500 dark:text-red-400">{error}</p>}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Première visite ? <a href="/inscription" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Inscrivez-vous</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
