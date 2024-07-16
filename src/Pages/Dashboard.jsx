import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { PiNavigationArrow } from 'react-icons/pi';
import parse from 'html-react-parser';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { Spinner } from "@material-tailwind/react";
import RenderAcceuil from '../Components/RenderAcceuil';
import RenderArticle from '../Components/RenderArticle';
import { FaSignOutAlt } from 'react-icons/fa';
import Footer from '../Components/Footer';
import ProfileSettings from '../Components/ProfileSettings';
import SettingsPage from '../Components/SettingsPage';


const Dashboard = () => {

    
  

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }
  
    try {
      const response = await axios.get(`http://52.207.130.7/wp-json/wp/v2/search?search=${searchTerm}&subtype=article`);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to search:', error);
      setResults([]);
    }
  };
  
    
  
    const userName = localStorage.getItem('conUserName');
    const [selectedMenu, setSelectedMenu] = useState('acceuil');
    const [posts, setPosts] = useState([]);
    const [articles, setArticles] = useState([]);
    const [legislations, setLegislations] = useState([]);
    const [decisions, setDecisions] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      if (['posts', 'articles', 'legislations', 'decisions'].includes(selectedMenu)) {
        fetchData(selectedMenu);
      }
    }, [selectedMenu]);
  
    const fetchData = async (menu) => {
      setLoading(true);
      setError('');
      try {
        let res;
        switch (menu) {
          case 'acceuil':
            res = await axios.get('http://52.207.130.7/wp-json/wp/v2/posts');
            setPosts(res.data);
            break;
          case 'articles':
            res = await axios.get('http://52.207.130.7/wp-json/wp/v2/articles');
            setArticles(res.data);
            break;
          case 'legislations':
            res = await axios.get('http://52.207.130.7/wp-json/wp/v2/legislations');
            setLegislations(res.data);
            break;
          case 'decisions':
            res = await axios.get('http://52.207.130.7/wp-json/wp/v2/decisions');
            setDecisions(res.data);
            break;
          default:
            throw new Error('Invalid menu selection');
        }
      } catch (err) {
        setError(`Failed to fetch ${menu}`);
      } finally {
        setLoading(false);
      }
    };


    
  
    const renderContent = () => {
      switch (selectedMenu) {
        case 'acceuil':
          return (
            <div className='bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text '>
                <RenderAcceuil/>
            </div>
          );
        case 'decisions':
          return (
            <div>
      <div className="mr-6 lg:w-[1200px] lg:h-[500px] mt-8 py-2 flex-shrink-0 flex flex-col bg-white dark:bg-gray-600 rounded-lg">
        <h3 className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-gray-300">
          <span>Decisions</span>
          <button className="ml-2">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 256 512">
              <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
            </svg>
          </button>
        </h3>
        <div>
          {loading ? (
            <p>Loading decisions...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul className="pt-1 pb-2 px-3 overflow-y-auto">
              {decisions.map((decision) => (
                <li key={decision.id} className="mt-2">
                  <Link to={`/decision/${decision.id}`} className="p-5 flex flex-col justify-between bg-gray-100 dark:bg-gray-200 rounded-lg">
                    <div className="flex items-center justify-between font-semibold capitalize dark:text-gray-700">
                      <span>{decision.title?.rendered || 'No Title'}</span>
                    </div>
                    <p className="text-sm font-medium leading-snug text-gray-600 my-3">
                      {parse(decision.excerpt?.rendered) || 'No Excerpt'}
                    </p>
                    
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
          );
        case 'legislations':
          return (
            <div>
              <h3 className="mt-8 flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-gray-300">
          <span>Legislations</span>
          <button className="ml-2">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 256 512">
              <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
            </svg>
          </button>
        </h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="flex flex-wrap">
        {legislations.map((legislation, index) => (
          <div key={index} className="w-full md:w-1/2 p-2 box-border">
            <h3 className="text-x">
              <Link to={`/legislation/${legislation.id}`}>{legislation.title.rendered}</Link>
            </h3>
            
          </div>
        ))}
      </div>
    </div>

          );
        case 'articles':
          return (
            <div>
            <div className="mr-6 lg:w-[1200px] mt-8 py-2 flex-shrink-0 flex flex-col bg-white dark:bg-gray-600 rounded-lg">
              <h3 className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-gray-300">
                <span>Articles</span>
                <button className="ml-2">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 256 512">
                    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
                  </svg>
                </button>
              </h3>
              <div >
                {loading ? (
                  <p ><Spinner /></p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <ul className="pt-1 pb-2 px-3 overflow-y-auto">
                    {articles.map((article) => (
                      <li key={article.id} className="mt-2">
                        <Link to={`/article/${article.id}`} className="p-5 flex flex-col justify-between bg-gray-100 dark:bg-gray-200 rounded-lg">
                          <div className="flex items-center justify-between font-semibold capitalize dark:text-gray-700">
                            <span>{article.title?.rendered || 'No Title'}</span>
                          </div>
                          <p className="text-sm font-medium leading-snug text-gray-600 my-3">
                            {parse(article.excerpt?.rendered) || 'No Excerpt'}
                          </p>
                          <div className="flex justify-between">
                            {/* <div className="flex">
                              <img className="h-6 w-6 rounded-full mr-3" src={article.featured_image_url || ''} alt={article.title?.rendered || 'No Title'} />
                              <span>
                                <span className="text-blue-500 font-semibold">{article.author_name || 'Unknown Author'}</span>
                              </span>
                            </div> */}
                            <p className="text-sm font-medium leading-snug text-gray-600">{article.date ? new Date(article.date).toLocaleDateString() : 'No Date'}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          );
        case 'profils':
            return(
              
                <ProfileSettings/>
              
            );
        case 'parametres' :
          return(
            <SettingsPage/>
          )
        case 'search':
            return (
              <div>
                        {loading ? (
                <p>searching...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <ResultsList results={results} />
              )}
          
              </div>

  
            );
        
        default:
          return <div>Select a menu item</div>;
      }
    };



    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

    const toggleProfileMenu = () => {
        setProfileMenuOpen(!isProfileMenuOpen);
    };



    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = () => {
        // Logic for logging out the user
        localStorage.removeItem('token');
    localStorage.removeItem('conUserName');
    // Redirection vers la page d'accueil
    window.location.href = "/";
        console.log('User logged out');
        setShowConfirm(false);
    };



  return (
    <div>
      <div>
        

        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full md:w-auto">
                <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                       <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                 </button>
                <a href="/" className="flex ms-2 md:me-24">
                  <img src={logo} className="h-14 w-14 me-3" alt=" Logo" />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">African Legal Tech</span>
                </a>    
              </div>
              <div>
              <div>
                 {/* Search input on desktop screen */}
                 <div className="hidden mx-10 md:block">
                                <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
        
                                <input type="text" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); handleSearch(); setSelectedMenu('search');}} className="w-[600px] py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" placeholder="Search" />
                                </div>
                             </div>
                        {/* Search input on mobile screen */}
                             <div className="my-4 md:hidden">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                </span>
        
                                <input type="text"  onChange={(e) => {setSearchTerm(e.target.value); handleSearch(); setSelectedMenu('search');}} className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" placeholder="Search" />
                            </div>
                             </div>
                 </div>    
              
                        {/* Search input on mobile screen */}
                             {/* <div className="my-4 md:hidden">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                </span>
        
                                <input type="text" className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" placeholder="Search" />
                            </div>
                             </div> */}
                 </div>    
              <div className="flex items-center">
                  <div className="flex items-center ms-3">
                    <div>
                      
                      <div className="relative cursor-pointer flex items-center justify-between bg-bg-transparent group">
                        <Link to="#" className="text-white menu-hover text-base white mx-2">
                        <img className="w-14 h-14 rounded-full" src={logo} alt="user photo"/>
                        </Link>
                        
                        <div className="top-[50px] z-20 absolute left-[-65px] w-[150px] mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
                          <div className="py-[20px]">
                            <div onClick={() => setSelectedMenu('profils')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profil</div>
                            <Link onClick={() => setSelectedMenu('parametres')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Parametres</Link>
                            <Link onClick={() => setShowConfirm(true)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Deconnexion</Link>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
            </div>
          </div>
        </nav>
        
        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li onClick={() => setSelectedMenu('acceuil')}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">Acceuil</span>
                            </a>
                        </li>
                        <li onClick={() => setSelectedMenu('decisions')}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Decisions</span>
                                {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
                            </a>
                        </li>
                        
                        <li onClick={() => setSelectedMenu('legislations')}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Legislations</span>
                                {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
                            </a>
                        </li>
                        {/* <li className="relative">
                            <button onClick={toggleProfileMenu} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap mx-32">Profil</span>
                                <svg className={`w-5 h-5 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isProfileMenuOpen && (
                                <ul className="absolute left-0 w-full mt-1 space-y-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Voir Profil</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Editer Profil</a>
                                    </li>
                                </ul>
                            )}
                        </li> */}
                        {/* <li>
                            <a href="#" className="flex  items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Experts</span>
                            </a>
                        </li> */}
                        {/* <li className=' pt-[130%]'>
                        <button
                            className="flex items-center p-2 text-gray-900 w-full rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            onClick={() => setShowConfirm(true)}
                        >
                            <FaSignOutAlt className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="flex-1 ms-3 mx-32 whitespace-nowrap">Déconnexion</span>
                        </button>
                    </li> */}
        
                    
                
                    </ul>
                </div>
        
        </aside>
        
        
        <div className="p-4 sm:ml-64">
           <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        
            {/*popup deconnexion*/}
           {showConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Confirmer la déconnexion</h2>
                                <p className="mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        className="px-4 py-2 ml-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={handleLogout}
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
              {renderContent()}
           </div>
        </div>
            
           
            </div>

            
    </div>
    
  )
}




const ResultsList = ({ results }) => {
  const [articleExcerpts, setArticleExcerpts] = useState({});
  const [legislationTitles, setLegislationTitles] = useState({});

  useEffect(() => {
    const fetchArticleExcerpt = async (articleId) => {
      try {
        const response = await axios.get(`http://52.207.130.7/wp-json/wp/v2/articles/${articleId}`);
        const excerpt = response.data?.excerpt?.rendered || 'No Excerpt';
        setArticleExcerpts((prevExcerpts) => ({
          ...prevExcerpts,
          [articleId]: excerpt,
        }));
      } catch (error) {
        console.error(`Failed to fetch excerpt for article ${articleId}:`, error);
        setArticleExcerpts((prevExcerpts) => ({
          ...prevExcerpts,
          [articleId]: 'Failed to fetch excerpt',
        }));
      }
    };

    const fetchLegislationTitle = async (articleId) => {
      try {
        const altUrl = 'http://52.207.130.7';

        // Fetch article details
        const articleResponse = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${articleId}`);
        const articleData = articleResponse.data;

        // Extract section ID from article data
        const sectionId = articleData.acf.section; // Assuming 'section' is a custom field storing section ID

        // Fetch section details using section ID
        const sectionResponse = await axios.get(articleData._links['acf:post'][0].href);
        const sectionData = sectionResponse.data;

        // Extract chapter ID from section data
        const chapterId = sectionData.acf.chapitre; // Assuming 'chapitre' is a custom field storing chapter ID

        // Fetch chapter details using chapter ID
        const chapterResponse = await axios.get(sectionData._links['acf:post'][0].href);
        const chapterData = chapterResponse.data;

        // Extract titre ID from chapter data
        const titreId = chapterData.acf.titre; // Assuming 'titre' is a custom field storing titre ID

        // Fetch titre details using titre ID
        const titreResponse = await axios.get(chapterData._links['acf:post'][0].href);
        const titreData = titreResponse.data;

        // Extract legislation ID from titre data
        const legislationId = titreData.acf.legislation; // Assuming 'legislation' is a custom field storing legislation ID

        // Fetch legislation details using legislation ID
        const legislationResponse = await axios.get(titreData._links['acf:post'][0].href);
        const legislationTitle = legislationResponse.data?.title?.rendered || 'No Legislation Title';

        setLegislationTitles((prevTitles) => ({
          ...prevTitles,
          [articleId]: {
            title: legislationTitle,
            id: legislationId,
          },
        }));
      } catch (error) {
        console.error(`Failed to fetch legislation for article ${articleId}:`, error);
        setLegislationTitles((prevTitles) => ({
          ...prevTitles,
          [articleId]: 'Failed to fetch legislation',
        }));
      }
    };

    results.forEach((result) => {
      if (result.subtype === 'article' && !articleExcerpts[result.id]) {
        fetchArticleExcerpt(result.id);
        fetchLegislationTitle(result.id);
      }
    });
  }, [results, articleExcerpts]);

  if (results.length === 0) {
    return <p className="text-gray-500">No results found</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {results.map((result) => (
        <div key={result.id} className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">
          <Link
            to={result.subtype === 'legislation' ? `/legislation/${result.id}` : `/article/${result.id}`}
            className="text-black-500 hover:underline"
          >
            {result?.title || 'No Title'}
          </Link>
          </h2>
          <p className="text-gray-600 mb-2">
            Legislation:{' '}
            {legislationTitles[result.id] ? (
              <Link
                to={`/legislation/${legislationTitles[result.id].id}`}
                className="text-blue-500 hover:underline"
              >
                {legislationTitles[result.id].title}
              </Link>
            ) : (
              'Loading...'
            )}
          </p>
          <p className="text-gray-700">
            {result.subtype === 'article' && articleExcerpts[result.id] ? (
              <span dangerouslySetInnerHTML={{ __html: articleExcerpts[result.id] }} />
            ) : (
              'No Excerpt'
            )}
          </p>
          
          {/* <Link
            to={result.subtype === 'legislation' ? `/legislation/${result.id}` : `/article/${result.id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link> */}
        </div>
      ))}
    </div>
  );
};



export default Dashboard