import { useState, useEffect } from 'react';
import { Dropdown, Badge, Button, TextInput, Spinner } from 'flowbite-react';
import { IconSearch, IconLocation } from '@tabler/icons-react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import CitationImage from '../assets/Citation.png';
import anime from '../assets/anime.svg'

// Normalization for case-insensitive and accent-insensitive comparison
const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Static data for locations
const locations = {
  'Adamaoua': ["Ngaoundéré", "Banyo", "Tignère", "Vina", "Djohong", "Gbaya", "Bouba", "Mbere", "Mayo-Baléo", "Tibati"],
  'Centre': ["Yaoundé", "Obala", "Ayos", "Ebolowa", "Mengang", "Nkometou", "Bafia", "Ntui", "Mbalmayo", "Biyem-Assi"],
  'Est': ["Bertoua", "Abong-Mbang", "Belabo", "Batouri", "Gari-Gombo", "Kentzé", "Lomié", "Ngoura", "Yokadouma", "Nguélémendouka"],
  'Extrême-Nord': ["Maroua", "Kousseri", "Yagoua", "Kaélé", "Mora", "Kolofata", "Roua", "Pétévo", "Waza", "Moulvoudaye"],
  'Littoral': ["Douala", "Bonabéri", "Deïdo", "Akwa", "Bassa", "Limbe", "Tiko", "Buea", "Idanau", "Manoka"],
  'Nord': ["Garoua", "Maroua", "Koza", "Mokolo", "Pitoa", "Figuil", "Mayo-Oulo", "Mandara", "Ngong", "Tchaourou"],
  'Nord-Ouest': ["Bamenda", "Fundong", "Bali", "Bafut", "Oku", "Ndop", "Wum", "Kumbo", "Batibo", "Bafut"],
  'Sud-Ouest': ["Limbe", "Buea", "Tiko", "Muea", "Fako", "Mbonge", "Buea II", "Limbe II", "Muea", "Limbe"],
  'Sud': ["Ebolowa", "Akom", "Obala", "Ngoulemakong", "Mven", "Akom II", "Nkomo", "Bipindi", "Kribi", "Campo"],
  'Ouest': ["Dschang", "Foumban", "Bafoussam", "Dibang", "Dizangué", "Fongondé", "Nkong-Zem", "Sia", "Bansoa", "Dschang"]
};



export default function Component() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [expertsData, setExpertsData] = useState([]);
  const [avatarUrls, setAvatarUrls] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const authToken = localStorage.getItem('token'); // Replace with your actual token
  const [totalPages, setTotalPages] = useState(1);
  const [currentApiPage, setCurrentApiPage] = useState(1);
  const expertsPerPage = 20; // Increased from 4 to fetch more experts per API call

  
  const [suggestions, setSuggestions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      setError('');
      try {
        let allExperts = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const response = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/users`, {
            params: {
              professions: 'Avocat,Notaire',
              per_page: 100, // Maximum allowed by WordPress API
              page: page,
            },
            headers: {
              Authorization: `Bearer ${authToken}`
            },
          });

          const validExperts = response.data.filter(expert => 
            expert.acf && expert.acf.nom && expert.acf.prenom && 
            expert.acf.nom.trim() !== '' && expert.acf.prenom.trim() !== ''
          );

          allExperts = [...allExperts, ...validExperts];

          if (response.data.length < 100) {
            hasMorePages = false;
          } else {
            page++;
          }
        }

        setExpertsData(allExperts);
        setTotalPages(Math.ceil(allExperts.length / expertsPerPage));

        // Fetch avatar URLs
        const avatarRequests = allExperts.map(async (expert) => {
          if (expert.acf.avatar) {
            try {
              const avatarResponse = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/media/${expert.acf.avatar}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`
                },
              });
              return { id: expert.id, url: avatarResponse.data.source_url };
            } catch (error) {
              console.error(`Error fetching avatar for expert ${expert.id}:`, error);
              return { id: expert.id, url: '' };
            }
          }
          return { id: expert.id, url: '' };
        });

        const avatarResults = await Promise.all(avatarRequests);
        const avatarUrlMap = avatarResults.reduce((acc, { id, url }) => {
          acc[id] = url;
          return acc;
        }, {});

        setAvatarUrls(avatarUrlMap);

      } catch (error) {
        console.error('Error fetching experts:', error);
        setError('Erreur lors du chargement des experts. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, [selectedType]);

  // Filtrer les suggestions de lieux en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm) {
      const filteredSuggestions = getSuggestions(searchTerm);
      setSuggestions(filteredSuggestions.slice(0, 10));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);


    // Updated filteredExperts function
    const filteredExperts = expertsData.filter((expert) => {
      const searchTerms = searchTerm.toLowerCase().split(' ');
      const matchesSearch = searchTerms.every(term =>
        expert.acf.nom.toLowerCase().includes(term) ||
        expert.acf.prenom.toLowerCase().includes(term) ||
        (expert.acf.adresse && expert.acf.adresse.toLowerCase().includes(term)) ||
        (Array.isArray(expert.acf.profession) 
          ? expert.acf.profession.some(prof => prof.toLowerCase().includes(term))
          : typeof expert.acf.profession === 'string' 
            ? expert.acf.profession.toLowerCase().includes(term)
            : false) ||
        (expert.acf.specialite && expert.acf.specialite.some(spec => spec.toLowerCase().includes(term)))
      );
      const matchesLocation = searchTerms.every(term => {
        return (
          (expert.acf.adresse && normalizeString(expert.acf.adresse).includes(term)) ||
          Object.entries(locations).some(([region, cities]) => {
            return (
              cities.some(city => normalizeString(city).includes(term) && expert.acf.adresse && normalizeString(expert.acf.adresse).includes(city)) ||
              normalizeString(region).includes(term) && expert.acf.adresse && normalizeString(expert.acf.adresse).includes(region)
            );
          })
        );
      });
      
      return (
        (selectedDomain ? expert.acf.specialite && expert.acf.specialite.includes(selectedDomain) : true) &&
        (selectedLocation ? matchesLocation : true) &&
        (selectedType 
          ? (Array.isArray(expert.acf.profession) 
              ? expert.acf.profession.includes(selectedType)
              : expert.acf.profession === selectedType)
          : true) &&
        matchesSearch
      );
    });
  
    const pageCount = Math.ceil(filteredExperts.length / expertsPerPage);
    const displayedExperts = filteredExperts.slice(
      currentPage * expertsPerPage,
      (currentPage + 1) * expertsPerPage
    );
  
    const handlePageClick = (data) => {
      setCurrentPage(data.selected);
    };





// Fonction pour obtenir les suggestions de lieux (ville, région)
const getSuggestions = (term) => {
  const normalizedTerm = normalizeString(term);
  const matches = [];
  Object.entries(locations).forEach(([region, cities]) => {
    cities.forEach(city => {
      const cityRegion = `${city}, ${region}`;
      if (normalizeString(city).includes(normalizedTerm) || normalizeString(region).includes(normalizedTerm)) {
        matches.push(cityRegion);
      }
    });
  });
  return matches;
};

// Gérer la sélection d'un lieu dans les suggestions
const handleSelectLocation = (location) => {
  setSearchTerm(location);
  setSuggestions([]);
};



  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading animation" />
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-background text-light-text dark:text-dark-text p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Trouvez un expert</h1>
        <div className="space-y-4 flex flex-col items-center">
          <div className="sm:w-[650px] w-full flex items-center">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 md:pl-8">
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
                />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Rechercher un expert par nom, ville, region ou domaine..."
              className="w-full border-1 rounded-3xl py-2 px-4 pl-12 dark:bg-gray-800 border-gray-400 focus:ring-0 focus:border-1 sm:text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
            {suggestions.length > 0 && (
              <ul
                className="absolute z-10 w-[300px] max-h-[300px] overflow-y-auto mt-2 dark:bg-dark-background border  border-gray-300 rounded-lg shadow-lg"
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                    onClick={() => handleSelectLocation(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-8">
            <div className="flex border border-gray-400 px-3 rounded-3xl justify-between text-sm items-center gap-8 w-full sm:w-auto">
              <span className="text-light-text dark:text-dark-text">Domaine:</span>
              <select
                id="domaine"
                className="bg-gray-100 text-sm dark:bg-dark-background border-none focus:border-none focus:ring-0 text-light-text dark:text-dark-text p-2 rounded-lg w-full sm:w-[200px]"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="Droit des affaires">Droit des affaires</option>
                <option value="Droit de la famille">Droit de la famille</option>
                <option value="Droit immobilier">Droit immobilier</option>
                <option value="Droit du travail">Droit du travail</option>
                <option value="Droit pénal">Droit pénal</option>
                <option value="Droit de la propriété intellectuelle">
                  Droit de la propriété intellectuelle
                </option>
              </select>
            </div>
            <div className="flex border border-gray-400 px-3 rounded-3xl justify-between text-sm items-center gap-3 w-full sm:w-auto">
              <span className="text-light-text dark:text-dark-text">Type d'expert:</span>
              <select
                id="type"
                className="bg-gray-100 ml-8 text-sm dark:bg-dark-background border-none focus:border-none focus:ring-0 text-light-text dark:text-dark-text p-2 rounded-lg w-full sm:w-[150px]"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="Avocat">Avocat</option>
                <option value="Notaire">Notaire</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        {loading && (
          <div className="flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">
            {error}
          </div>
        )}
        {!loading && !error && displayedExperts.map((expert) => (
          <div
            key={expert.id}
            className="bg-white dark:bg-slate-700 rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto"
          >
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center">
              {avatarUrls[expert.id] ? (
                <img
                  src={avatarUrls[expert.id]}
                  alt={`Expert ${expert.acf.nom}`}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border border-gray-200 mb-4 sm:mb-0 sm:mr-6"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border border-gray-200 mb-4 sm:mb-0 sm:mr-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold dark:text-blue-200 text-blue-500">
                      <span className='font-semibold'>Me. </span> {expert.acf.nom} {expert.acf.prenom}
                    </h3>
                    <p className="dark:text-green-400">{expert.acf.profession}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-400 mt-2 sm:mt-0">
                    Vérifié
                  </Badge>
                </div>
                <p className="flex items-center justify-center sm:justify-start text-sm mb-2">
                  <IconLocation className="mr-1" size={16} />
                  {expert.acf.adresse}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Domaine d'expertise</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {expert.acf.specialite.map((spec, index) => (
                      <Badge key={index} className="bg-slate-200 text-slate-800">
                        {spec}
                        </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2">
                  <NavLink to={`${expert.id}`}>
                    <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-600 sm:items-center">Voir le profil</button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!loading && !error && (
          <div className="mt-8 flex justify-center">
            <ReactPaginate
              pageCount={pageCount}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              onPageChange={handlePageClick}
              containerClassName="flex space-x-2"
              activeClassName="text-white bg-green-500"
              previousLabel="<"
              nextLabel=">"
              breakLabel="..."
              pageClassName="px-3 py-1 rounded-full cursor-pointer"
              activeLinkClassName="bg-green-500 text-white"
              disabledClassName="opacity-50 cursor-not-allowed"
              breakClassName="px-3 py-1 rounded-full"
              previousClassName="px-3 py-1 rounded-full border border-gray-600"
              nextClassName="px-3 py-1 rounded-full border border-gray-600"
            />
          </div>
        )}
      </main>
    </div>
  );
}