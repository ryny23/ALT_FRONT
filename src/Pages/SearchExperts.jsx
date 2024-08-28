import { useState, useEffect } from 'react';
import { Dropdown, Badge, Button, TextInput, Spinner } from 'flowbite-react';
import { IconSearch, IconLocation } from '@tabler/icons-react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import CitationImage from '../assets/Citation.png';
import anime from '../assets/anime.svg'



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
  const expertsPerPage = 4;

  const authToken = localStorage.getItem('token'); // Replace with your actual token

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

  const filteredExperts = expertsData.filter((expert) => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const matchesSearch = searchTerms.every(term =>
      expert.acf.nom.toLowerCase().includes(term) ||
      expert.acf.prenom.toLowerCase().includes(term) ||
      expert.acf.adresse.toLowerCase().includes(term) ||
      expert.acf.profession.toLowerCase().includes(term) ||
      expert.acf.specialite.some(spec => spec.toLowerCase().includes(term))
    );

    return (
      (selectedDomain ? expert.acf.specialite.includes(selectedDomain) : true) &&
      (selectedLocation ? expert.acf.adresse.includes(selectedLocation) : true) &&
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
            />
          </div>
          <div className="pl-6 flex items-center bg-gray-100 dark:bg-dark-background text-light-text dark:text-dark-text justify-between gap-4">
            <Dropdown label="Filtrer par domaine" color="slate">
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedDomain('')}>
                Tous
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedDomain('Droit des affaires') }>
                Droit des affaires
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedDomain('Droit de la famille' )}>
                Droit de la famille
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedDomain('Droit immobilier')}> 
                Droit immobilier
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedDomain('Droit du travail')}> 
                Droit du travail
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedDomain('Droit pénal')}>
                 Droit pénal
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedDomain('Droit de la propriét é intellectuelle')}>
                Droit de la propriété intellectuelle
              </Dropdown.Item>
            </Dropdown>
            <Dropdown label="Filtrer par lieu" color="slate">
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedLocation('')}>
                Tous
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedLocation('Yaounde')}>
                Yaounde
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedLocation('Douala')}>
                Douala
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedLocation('Maroua')}>
                Maroua
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedLocation('Limbe')}>
                Limbe
              </Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedLocation('Buea')}>
                Buea
              </Dropdown.Item>
            </Dropdown>
            <Dropdown label="Filtrer par type d'expert" color="slate">
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedType('')}>Tous</Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedType('Avocat')}>Avocat</Dropdown.Item>
              <Dropdown.Item  className='hover:bg-gray-950' onClick={() => setSelectedType('Notaire')}>Notaire</Dropdown.Item>
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
