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
  const expertsPerPage = 4;

  
  const [suggestions, setSuggestions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch experts data
        const response = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users?professions=Avocat,Notaire', {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        });
        setExpertsData(response.data);

        // Fetch avatar URLs
        const avatarRequests = response.data.map(async (expert) => {
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



// Filtrage des experts en tenant compte des villes et des régions
const filteredExperts = expertsData.filter((expert) => {
  const searchTerms = searchTerm.toLowerCase().split(' ');
  const matchesSearch = searchTerms.every(term =>
    expert.acf.nom.toLowerCase().includes(term) ||
    expert.acf.prenom.toLowerCase().includes(term) ||
    expert.acf.adresse.toLowerCase().includes(term) ||
    expert.acf.profession.toLowerCase().includes(term) ||
    expert.acf.specialite.some(spec => spec.toLowerCase().includes(term))
  );
  const matchesLocation = searchTerms.every(term => {
    return (
      normalizeString(expert.acf.adresse).includes(term) ||
      Object.entries(locations).some(([region, cities]) => {
        return (
          cities.some(city => normalizeString(city).includes(term) && normalizeString(expert.acf.adresse).includes(city)) ||
          normalizeString(region).includes(term) && normalizeString(expert.acf.adresse).includes(region)
        );
      })
    );
  });
  
  return (
    (selectedDomain ? expert.acf.specialite.includes(selectedDomain) : true) &&
    (selectedLocation ? matchesLocation : true) &&
    (selectedType ? expert.acf.profession === selectedType : true) &&
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
    <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-background text-light-text dark:text-dark-text">
      <header className="bg-gray-100 dark:bg-dark-background text-light-text dark:text-dark-text py-4 px-6 rounded-t-lg">
        <h1 className="text-3xl font-bold">Trouvez un expert</h1>
        <div className="mt-6 space-y-4">
          <div className="relative px-48">
            <IconSearch className="absolute left-[165px] z-30 top-1/2 -translate-y-1/2 text-gray-400" />
            <TextInput
              type="search"
              placeholder="Rechercher un expert par nom, ville, region ou domaine..."
              className="w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-2/5 mt-2 dark:text-white dark:hover bg-white dark:bg-slate-800 border  border-gray-300 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                    onClick={() => handleSelectLocation(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
                {suggestions.length > 10 && !showAll && (
                  <li
                    className="px-4 py-3 text-blue-500 cursor-pointer dark:hover:bg-gray-950 hover:bg-gray-100"
                    onClick={() => setShowAll(true)}
                  >
                    Voir plus
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="pl-6 flex items-center bg-gray-100 dark:bg-dark-background text-light-text dark:text-dark-text justify-between gap-4">
            <Dropdown label="Filtrer par domaine" color="slate">
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedDomain('')}>
                Tous
              </Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedDomain('Droit des affaires') }>
                Droit des affaires
              </Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedDomain('Droit de la famille' )}>
                Droit de la famille
              </Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedDomain('Droit immobilier')}> 
                Droit immobilier
              </Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedDomain('Droit du travail')}> 
                Droit du travail
              </Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedDomain('Droit pénal')}>
                 Droit pénal
              </Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedDomain('Droit de la propriét é intellectuelle')}>
                Droit de la propriété intellectuelle
              </Dropdown.Item>
            </Dropdown>
            <Dropdown label="Filtrer par type d'expert" color="slate">
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedType('')}>Tous</Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedType('Avocat')}>Avocat</Dropdown.Item>
              <Dropdown.Item  className='dark:hover:bg-gray-950' onClick={() => setSelectedType('Notaire')}>Notaire</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </header>
      <div className="bg-gray-100 dark:bg-dark-background text-light-text dark:text-dark-text grid gap-6 p-6 md:p-10 lg:p-12">
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
            className="pl-4 w-full bg-white dark:bg-slate-700 md:w-[800px] rounded-2xl shadow-lg overflow-hidden mx-auto flex flex-col md:flex-row items-center justify-center"
          >
            <img
              src={avatarUrls[expert.id] || 'default-avatar-url'} // Assuming avatar is a URL, adjust if necessary
              alt={`Expert ${expert.acf.nom}`}
              className="w-full rounded-full md:w-40 md:h-40 object-cover border border-gray-200"
            />
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold dark:text-blue-200 text-blue-500">{expert.acf.nom} {expert.acf.prenom}</h3>
                  <p className="dark:text-green-400">{expert.acf.profession}</p>
                </div>
                <Badge className="bg-green-100 text-green-400">Vérifié</Badge>
              </div>
              <p className="flex text-sm">
                <IconLocation className="text-sm mr-1" />
                {expert.acf.adresse}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-sm  flex flex-col font-semibold">Domaine d'expertise</p>
                {expert.acf.specialite.map((spec, index) => (
                  <Badge key={index} className="bg-slate-200 text-slate-800">{spec}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-sm  flex flex-col font-semibold">Expérience</p>
                <Badge className="bg-slate-200 text-slate-800">{expert.experience} ans</Badge>
              </div>
              <div className="mt-4">
                <NavLink to={(`${expert.id}`)}>
                  <button className="bg-gray-200 dark:bg-gray-800 py-2 px-4 rounded-lg">Voir le profil</button>
                </NavLink>
              </div>
            </div>
          </div>
        ))}
        {!loading && !error && (
          <div className="mt-8">
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination flex justify-center'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link px-3 py-1 border rounded-md'}
              previousLinkClassName={'page-link px-3 py-1 border rounded-md'}
              nextLinkClassName={'page-link px-3 py-1 border rounded-md'}
              breakLinkClassName={'page-link px-3 py-1 border rounded-md'}
              activeClassName={'active bg-slate-950 text-white'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
