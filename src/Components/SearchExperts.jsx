import { useState } from 'react';
import { Dropdown, Badge, Button, TextInput } from 'flowbite-react';
import { IconSearch } from '@tabler/icons-react';
import ReactPaginate from 'react-paginate';
import { IconLocation } from "@tabler/icons-react";
import CitationImage from '../assets/Citation.png'

const expertsData = [
{
    name: 'Maître Annita',
    role: 'Notaire',
    address: 'Nkoabang, Yaounde',
    domain: 'Droit de la famille',
    experience: 12,
    photo: CitationImage,
  },
  {
    name: 'Maître Norbert',
    role: 'Avocat',
    address: 'Maroua',
    domain: 'Droit de la famille',
    experience: 8,
    photo: CitationImage,
  },
  {
    name: 'Maître Roland',
    role: 'Huissier',
    address: 'Limbe',
    domain: 'Droit immobilier',
    experience: 2,
    photo: CitationImage,
  },
  {
    name: 'Maître NDO',
    role: 'Notaire',
    address: 'Buea',
    domain: 'Droit de la propriété intellectuelle',
    experience: 5,
    photo: CitationImage,
  },
  {
    name: 'Maître Marcel',
    role: 'Avocat',
    address: 'Nkomo, Yaounde',
    domain: 'Droit des affaires',
    experience: 15,
    photo: CitationImage,
  },
  {
    name: 'Maître Gaetan',
    role: 'Avocat',
    address: 'Maroua',
    domain: 'Droit du travail',
    experience: 10,
    photo: CitationImage,
  },
  {
    name: 'Maître Dupont',
    role: 'Avocat',
    address: 'Fouda, Yaounde',
    domain: 'Droit des affaires',
    experience: 13,
    photo: CitationImage,
  },
  {
    name: 'Maître Leroy',
    role: 'Huissier',
    address: 'Mimboman, Yaounde',
    domain: 'Droit de la famille',
    experience: 10,
    photo: CitationImage,
  },
  {
    name: 'Maître Mercier',
    role: 'Notaire',
    address: 'Akwa, Douala',
    domain: 'Droit immobilier',
    experience: 8,
    photo: CitationImage,
  },
  {
    name: 'Maître Girard',
    role: 'Huissier',
    address: 'Bastos, Yaounde',
    domain: 'Droit du travail',
    experience: 12,
    photo: CitationImage,
  },
  {
    name: 'Maître Rousseau',
    role: 'Avocat',
    address: 'Biyem-Assi, Yaounde',
    domain: 'Droit pénal',
    experience: 18,
    photo: CitationImage,
  },
  {
    name: 'Maître Lefebvre',
    role: 'Avocat',
    address: 'Makepe, Douala',
    domain: 'Droit de la propriété intellectuelle',
    experience: 14,
    photo: CitationImage,
  },
];

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const expertsPerPage = 4;

  const filteredExperts = expertsData.filter((expert) => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const matchesSearch = searchTerms.every(term =>
      expert.name.toLowerCase().includes(term) ||
      expert.role.toLowerCase().includes(term) ||
      expert.address.toLowerCase().includes(term) ||
      expert.domain.toLowerCase().includes(term)
    );

    return (
      (selectedDomain ? expert.domain === selectedDomain : true) &&
      (selectedLocation ? expert.address.includes(selectedLocation) : true) &&
      (selectedType ? expert.role === selectedType : true) &&
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

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <header className="bg-slate-950 text-white py-4 px-6 rounded-t-lg">
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
              <Dropdown.Item onClick={() => setSelectedDomain('')}>
                Tous
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit des affaires')}>
                Droit des affaires
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit de la famille')}>
                Droit de la famille
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit immobilier')}>
                Droit immobilier
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit du travail')}>
                Droit du travail
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit pénal')}>
                Droit pénal
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedDomain('Droit de la propriété intellectuelle')}>
                Droit de la propriété intellectuelle
              </Dropdown.Item>
            </Dropdown>
            <Dropdown label="Filtrer par lieu" color="slate">
              <Dropdown.Item onClick={() => setSelectedLocation('')}>
                Tous
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Yaounde')}>
                Yaounde
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Douala')}>
                Douala
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Maroua')}>
                Maroua
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Limbe')}>
                Limbe
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedLocation('Buea')}>
                Buea
              </Dropdown.Item>
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
      <div className="grid gap-6 p-6 md:p-10 lg:p-12">
        {displayedExperts.map((expert) => (
          <div
            key={expert.name}
            className="pl-4 bg-white w-full md:w-[800px] rounded-2xl shadow-lg overflow-hidden mx-auto flex flex-col md:flex-row items-center justify-center"
          >
            <img
              src={expert.photo}
              alt={`Expert ${expert.name}`}
              className="w-full rounded-full md:w-40 md:h-40 object-cover"
            />
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-blue-500">{expert.name}</h3>
                  <p className="text-gray-500">{expert.role}</p>
                </div>
                <Badge className="bg-green-100 text-green-400">Vérifié</Badge>
              </div>
              <p className="flex text-sm">
                <IconLocation className="text-sm mr-1" />
                {expert.address}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-sm text-black flex flex-col font-semibold">Domaine d'expertise</p>
                <Badge className="bg-slate-200 text-slate-800">{expert.domain}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-sm text-black flex flex-col font-semibold">Expérience</p>
                <Badge className="bg-slate-200 text-slate-800">{expert.experience} ans</Badge>
              </div>
              <div className="mt-4">
                <Button color="slate">Voir le profil</Button>
              </div>
            </div>
          </div>
        ))}
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
      </div>
    </div>
  );
}
