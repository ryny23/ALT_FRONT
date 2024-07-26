import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Badge, Button, TextInput } from 'flowbite-react';
// import { SearchIcon } from '@heroicons/react/outline';
import { IconSearch } from '@tabler/icons-react';
import ReactPaginate from 'react-paginate';

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [expertsData, setExpertsData] = useState([]);
  const expertsPerPage = 3;


  // Fetch experts data from an API using Axios
  useEffect(() => {
    async function fetchExperts() {
      try {
        const response = await axios.get('http://52.207.130.7/wp-json/wp/v2/users/'); // Remplacez par votre URL d'API
        setExpertsData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }

    fetchExperts();
  }, []);

  const filteredExperts = expertsData.filter((expert) => {
    return (
      (selectedDomain ? expert.domain === selectedDomain : true) &&
      (selectedLocation ? expert.address.includes(selectedLocation) : true) &&
      (selectedType ? expert.role === selectedType : true) &&
      (searchTerm ? expert.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
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

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <header className="bg-black border-b-2 border-gray-400 text-white py-4 px-6 rounded-t-lg">
        <h1 className="text-2xl font-bold">Trouvez un expert</h1>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <TextInput
              type="search"
              placeholder="Rechercher un expert..."
              className="pl-10 w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Dropdown label="Filtrer par domaine" color="slate">
              <Dropdown.Item onClick={() => setSelectedDomain('')}>Tous</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit des affaires')}>Droit des affaires</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit de la famille')}>Droit de la famille</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit immobilier')}>Droit immobilier</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit du travail')}>Droit du travail</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit pénal')}>Droit pénal</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit de la propriété intellectuelle')}>Droit de la propriété intellectuelle</Dropdown.Item>
            </Dropdown>
            <Dropdown label="Filtrer par lieu" color="slate">
              <Dropdown.Item onClick={() => setSelectedLocation('')}>Tous</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Paris')}>Paris</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Lyon')}>Lyon</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Marseille')}>Marseille</Dropdown.Item>
            </Dropdown>
            <Dropdown label="Filtrer par type d'expert" color="slate">
              <Dropdown.Item onClick={() => setSelectedType('')}>Tous</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedType('Avocat')}>Avocat</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedType('Huissier')}>Huissier</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedType('Notaire')}>Notaire</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </header>
      <main className="p-6">
        {displayedExperts.map((expert) => (
          <div key={expert.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-xl font-bold">{expert.name}</h2>
            <p className="text-gray-600">{expert.domain}</p>
            <p className="text-gray-600">{expert.address}</p>
            <Badge color="blue" className="mt-2">{expert.role}</Badge>
          </div>
        ))}
        <ReactPaginate className='flex justify-center gap-14 mt-4'
          previousLabel={'Précédent'}
          nextLabel={'Suivant'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </main>
    </div>
  );
}
