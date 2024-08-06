import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import parse from 'html-react-parser';
import { NavLink, Link } from 'react-router-dom';
import { Spinner } from "@material-tailwind/react";
import { FaUserAlt } from 'react-icons/fa';






const Dashboard = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarId, setAvatarId] = useState(null);
  const [theme, setTheme] = useState('');
  const [isExpert, setIsExpert] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data;
            setTheme(userData.acf.theme);
           

            const avatarId = userData.acf.avatar;
            if (avatarId) {
                setAvatarId(avatarId);
                const avatarResponse = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/media/${avatarId}`);
                setAvatarUrl(avatarResponse.data.source_url);
            }

            const profession = userData.acf.profession;
                if (profession === 'Avocat' || profession === 'Notaire') {
                    setIsExpert(true);
                    console.error("c'est un expert");
                }

            
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        setLoading(false);
    };

    fetchUserData();
}, []);

useEffect(() => {
  if (theme) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
  

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }
  
    try {
      const response = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/search?search=${searchTerm}&subtype=article`);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to search:', error);
      setResults([]);
    }
  };
  
    
  
    const userName = localStorage.getItem('conUserName');
    const [selectedMenu, setSelectedMenu] = useState('acceuil');
    const [posts, setPosts] = useState([]);
    const [commentaires, setcommentaires] = useState([]);
    const [legislations, setLegislations] = useState([]);
    const [decisions, setDecisions] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  


    

    
  
    useEffect(() => {

      if (['posts', 'commentaires', 'legislations', 'decisions'].includes(selectedMenu)) {
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
            res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/posts');
            setPosts(res.data);
            break;
          case 'commentaires':
            res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires');
            setcommentaires(res.data);
            break;
          case 'legislations':
            res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations');
            setLegislations(res.data);
            break;
          case 'decisions':
            res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions');
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
            <div className="mr-6 lg:w-[1200px] mt-8 py-2 flex-shrink-0 flex flex-col bg-white dark:bg-gray-600 rounded-lg">
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
                  <div className="flex justify-center items-center h-screen">
                  <img src={anime} alt="Loading" />
                </div>
                ) : error ? (
                  <div>{error}</div>
                ) : (
                  <ul className="pt-1 pb-2 px-3 overflow-y-auto">
                    {decisions.map((decision) => (
                      <li key={decision.id} className="mt-2">
                        <Link to={`decision/${decision.id}`} className="pt-5 flex flex-col justify-between  dark:bg-gray-200 rounded-lg">
                          <div className="flex items-center justify-between font-semibold capitalize dark:text-gray-700">
                            <span>{decision.title?.rendered || 'No Title'}</span>
                          </div>
                          </Link>
                          
                          <div className="text-sm font-medium leading-snug text-gray-600 my-3">
                            {parse(decision.excerpt?.rendered) || 'No Excerpt'}
                          </div>
                          {/* <div className="flex justify-between">
                            <p className="text-sm font-medium leading-snug text-gray-600">{commentaire.date ? new Date(commentaire.date).toLocaleDateString() : 'No Date'}</p>
                          </div> */}
                        
                        
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
  <div className="mr-6 lg:w-[1200px] mt-8 py-2 flex-shrink-0 flex flex-col bg-white dark:bg-gray-600 rounded-lg">
    <h3 className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-gray-300">
      <span>Legislation</span>
      <button className="ml-2">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 256 512">
          <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
        </svg>
      </button>
    </h3>
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading" />
      </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className="pt-1 pb-2 px-3 overflow-y-auto">
          {legislations.map((legislation) => (
            <li key={legislation.id} className="mt-2">
              <Link to={`legislation/${legislation.id}`} className="pt-5 flex flex-col justify-between  dark:bg-gray-200 rounded-lg">
                <div className="flex items-center justify-between font-semibold capitalize dark:text-gray-700">
                  <span>{legislation.title?.rendered || 'No Title'}</span>
                </div>
                </Link>
                
                <div className="text-sm font-medium leading-snug text-gray-600 my-3">
                  {parse(legislation.excerpt?.rendered) || 'No Excerpt'}
                </div>
                {/* <div className="flex justify-between">
                  <p className="text-sm font-medium leading-snug text-gray-600">{commentaire.date ? new Date(commentaire.date).toLocaleDateString() : 'No Date'}</p>
                </div> */}
              
              
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>

          );
        // case 'commentaires':
        //     return (
        //       <RenderCommentaire/>
  
        //   );
        case 'profilExpert':
            return (
              <SearchExperts/>
  
        );
        case 'parametresExpert':
            return (
              <ExpertsProfileSettings/>
  
        );
        case 'aide' :
          return(
            <AidePage/>
          );
        case 'dossiers' :
          return(
            <RenderDossiers />
          );
        case 'alertes' :
          return(
            <RenderAlertes />
          );
        case 'avis' :
          return(
            <Avis />
          );
        
        case 'commentaires':
          return (
            <div>
  <div className="mr-6 lg:w-[1200px] mt-8 py-2 flex-shrink-0 flex flex-col bg-white dark:bg-gray-600 rounded-lg">
    <h3 className="flex items-center pt-1 pb-1 px-8 text-lg font-semibold capitalize dark:text-gray-300">
      <span>commentaires</span>
      <button className="ml-2">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 256 512">
          <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
        </svg>
      </button>
    </h3>
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading" />
      </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className="pt-1 pb-2 px-3 overflow-y-auto">
          {commentaires.map((commentaire) => (
            <li key={commentaire.id} className="mt-2">
              <Link to={`commentaire/${commentaire.id}`} className="pt-5 flex flex-col justify-between  dark:bg-gray-200 rounded-lg">
                <div className="flex items-center justify-between font-semibold capitalize dark:text-gray-700">
                  <span>{commentaire.title?.rendered || 'No Title'}</span>
                </div>
                </Link>
                {commentaire.acf.url && (
                <a href={commentaire.acf.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {commentaire.acf.url}
                </a>
              )}
                <div className="text-sm font-medium leading-snug text-gray-600 my-3">
                  {parse(commentaire.excerpt?.rendered) || 'No Excerpt'}
                </div>
                {/* <div className="flex justify-between">
                  <p className="text-sm font-medium leading-snug text-gray-600">{commentaire.date ? new Date(commentaire.date).toLocaleDateString() : 'No Date'}</p>
                </div> */}
              
              
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
    <div className="">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="logo-sidebar"
                type="button"
                className="border border-gray-400 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link to="/" className="flex ms-2 md:me-24">
                <img
                  src={logo}
                  className="h-10 w-10 me-3 rounded-full"
                  alt=" Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  African Legal Tech
                </span>
              </Link>
            </div>
            <div>
              <div>
                {/* Search input on desktop screen */}
                <div className="hidden mx-10 md:block">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch();
                        setSelectedMenu("search");
                      }}
                      className="w-[600px] py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                    />
                  </div>
                </div>
                {/* Search input on mobile screen */}
                <div className="my-4 md:hidden">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>

                    <input
                      type="text"
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch();
                        setSelectedMenu("search");
                      }}
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                    />
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
                <div className="flex items-center justify-center gap-10">
                  <div className="flex flex-col items-center text-center">
                    <Link to="alertes" className="flex flex-col items-center">
                      <svg
                        className="w-7 h-7 text-gray-700 dark:text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Alertes
                      </span>
                    </Link>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Link to="dossier" className="flex flex-col items-center">
                      <svg
                        className="w-7 h-7 text-gray-700 dark:text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Dossiers
                      </span>
                    </Link>
                  </div>

                  <div className="flex flex-col items-center relative cursor-pointer group">
                    <button className="flex flex-col items-center">
                      {/* <FaUserAlt className="text-gray-500 w-14 h-6" /> */}
                      <img
                        className="w-7 h-7 rounded-full"
                        src={avatarUrl || "https://placehold.co/96x96"}
                        alt="user photo"
                      />
                      <span className=" text-center text-sm text-gray-700 dark:text-gray-300">
                        Compte
                      </span>
                    </button>
                    <div className="top-[43px] z-20 absolute left-[-85px] w-[150px] mt-1 bg-white dark:bg-slate-700 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
                      <div className="py-[20px]">
                        <Link
                          to="profil"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                        >
                          Profil
                        </Link>
                        <Link
                          to="parametres"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                        >
                          Parametres
                        </Link>
                        {isExpert && (
                          <Link
                            to="parametres-expert"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                          >
                            Paramètres experts
                          </Link>
                        )}
                        <Link
                          to="aide"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                        >
                          Aide
                        </Link>
                        <a
                          onClick={() => setShowConfirm(true)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                        >
                          Déconnexion
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-300 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="mt-2 space-y-2 font-medium">
            <li>
              <Link
                to=""
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Acceuil</span>
              </Link>
            </li>
            <li onClick={() => setSelectedMenu('decisions')}>
              <NavLink
                to="decisions"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Décisions</span>
                {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
              </NavLink>
            </li>

            <li onClick={() => setSelectedMenu('legislations')}>
              <NavLink
                to="legislations"
                data
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Législations
                </span>
                {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
              </NavLink>
            </li>

            <li onClick={() => setSelectedMenu('commentaires')}>
              <Link
                to="commentaires"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Commentaires
                </span>
                {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span> */}
              </Link>
            </li>

            {/* <li onClick={() => setSelectedMenu('commentaires')}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Commentaires</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </a>
                        </li>  */}

            {/* <li className="relative">
                            <button onClick={toggleProfileMenu} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <Link to="search" className="flex-1 ms-3 whitespace-nowrap mx-32">Expert</Link>
                            </button>
                        </li> */}

            <li className="relative">
              <Link
                to="search"
                onClick={toggleProfileMenu}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Experts</span>
              </Link>
            </li>
            <li className="relative">
              <Link
                to="avis"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Donner un avis
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

          {/*popup deconnexion*/}
      <div className="sm:ml-64">
        <div className="rounded-lg">
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
              <div className="dark:bg-gray-800 bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Confirmer la déconnexion
                </h2>
                <p className="mb-6">
                  Êtes-vous sûr de vouloir vous déconnecter ?
                </p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 dark:hover:bg-gray-950 hover:bg-gray-300"
                    onClick={() => setShowConfirm(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-4 py-2 ml-2 text-white bg-red-500 hover:bg-red-600"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



const ResultsList = ({ results }) => {
  const [articleExcerpts, setArticleExcerpts] = useState({});
  const [legislationTitles, setLegislationTitles] = useState({});
  
  useEffect(() => {
    const fetchArticleExcerpt = async (articleId) => {
      try {
        const response = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles/${articleId}`);
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
        const altUrl = 'https://alt.back.qilinsa.com';
    
        // Fetch article details
        const articleResponse = await axios.get(`${altUrl}/wp-json/wp/v2/articles/${articleId}`);
        const articleData = articleResponse.data;
    
        // Extract legislation ID from titre data
        const legislationId = articleData.acf.Legislation_ou_titre_ou_chapitre_ou_section; // Assuming 'legislation' is a custom field storing legislation ID
        if (!legislationId) throw new Error("Legislation ID not found");
    
        // Fetch legislation details using legislation ID
        const legislationResponse = await axios.get(`${altUrl}/wp-json/wp/v2/legislations/${legislationId}`);
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
        </div>
      ))}
    </div>
  );
};



export default Dashboard