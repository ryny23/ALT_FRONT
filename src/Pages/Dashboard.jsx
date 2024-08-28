import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { NavLink, Link } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';



const Dashboard = ({  }) => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarId, setAvatarId] = useState(null);
  const [theme, setTheme] = useState('');
  const [isExpert, setIsExpert] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);



  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      // Scroll down
      setIsVisible(false);
    } else {
      // Scroll up
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

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

  
    
  
    const userName = localStorage.getItem('conUserName');
    const [selectedMenu, setSelectedMenu] = useState('');
    const [posts, setPosts] = useState([]);
    
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    


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


    const [activePage, setActivePage] = useState('all'); // par défaut, tous les résultats
    const [resultCounts, setResultCounts] = useState({});

    const handleResultsUpdate = (counts) => {
      setResultCounts(counts);
    };
    const [legislations, setLegislations] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [articles, setArticles] = useState([]);
    const [commentaires, setCommentaires] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const legislationsResponse = await axios.get('/api/legislations');
          const decisionsResponse = await axios.get('/api/decisions');
          const articlesResponse = await axios.get('/api/articles');
          const commentairesResponse = await axios.get('/api/commentaires');
  
          setLegislations(legislationsResponse.data);
          setDecisions(decisionsResponse.data);
          setArticles(articlesResponse.data);
          setCommentaires(commentairesResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    // Assurez-vous que les données sont disponibles avant de rendre l'Outlet
    if (!legislations.length && !decisions.length && !articles.length && !commentaires.length) {
      return <div>Loading...</div>;
    }
  



  return (
    <div className="">
      <nav className={`fixed top-0 z-50 w-full  border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ${
        isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}>
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
              <NavLink to="/" className="flex ms-2 md:me-24">
                <img
                  src={logo}
                  className="h-10 w-10 me-3 rounded-full"
                  alt=" Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  African Legal Tech
                </span>
              </NavLink>
            </div>
            <div>
              <div className='SearchBar'>
                <SearchBar
                  context={{
                    legislations,
                    decisions,
                    articles,
                    commentaires
                  }}
                 />
                 
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className="flex items-center justify-center gap-10">
                  <div className="flex flex-col items-center text-center">
                    <NavLink to="alertes" className="flex flex-col items-center">
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
                    </NavLink>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <NavLink to="dossier" className="flex flex-col items-center">
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
                    </NavLink>
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
                        <NavLink
                          to="profil"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                        >
                          Profil
                        </NavLink>
                        <NavLink
                          to="parametres"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                        >
                          Parametres
                        </NavLink>
                        {isExpert && (
                          <NavLink
                            to="parametres-expert"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                          >
                            Paramètres experts
                          </NavLink>
                        )}
                        <NavLink
                          to="aide"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950"
                        >
                          Aide
                        </NavLink>
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
              <NavLink
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
              </NavLink>
            </li>
            <li>
              <NavLink
                  to="decision"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`
                  }
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

            <li>
              <NavLink
                  to="legislation"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`
                  }
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
              <NavLink
                  to="commentaire"
                  className={({ isActive }) =>
                    `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`
                  }
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
              </NavLink>
            </li>
            <li className="relative">
            <NavLink
                to="expert"
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`
                }
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
              </NavLink>
            </li>
            <li className="relative">
            <NavLink
                to="avis"
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 group ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`
                }
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
              </NavLink>
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
        {/* {renderContent()} */}
      </div>
    </div>
  );
}




export default Dashboard;