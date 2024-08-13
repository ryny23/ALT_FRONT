import { useState } from 'react';
import { TextInput, Spinner } from 'flowbite-react';
import { IconSearch } from '@tabler/icons-react';

// Données statiques des villes et régions corrigées
const regions = {
  'Centre': ['Yaoundé', 'Biyem-Assi', 'Nsimalen', 'Mbalmayo', 'Obala', 'Ayos', 'Ebolowa', 'Mengang', 'Nkometou', 'Bafoussam'],
  'Littoral': ['Douala', 'Bonabéri', 'Deïdo', 'Akwa', 'Bassa', 'Limbe', 'Tiko', 'Ebolowa', 'Buea', 'Idenau'],
  'Ouest': ['Dschang', 'Foumban', 'Bafoussam', 'Dibang', 'Dizangué', 'Fongondé', 'Nkong-Zem', 'Sia', 'Bansoa', 'Dschang'],
  'Nord': ['Maroua', 'Koza', 'Mokolo', 'Garoua', 'Ngong', 'Figuil', 'Mayo-Oulo', 'Pitoa', 'Tchaourou', 'Mandara'],
  'Sud': ['Ebolowa', 'Akom', 'Obala', 'Ngoulemakong', 'Mven', 'Akom II', 'Nkomo', 'Bipindi', 'Kribi', 'Campo'],
  'Nord-Ouest': ['Bamenda', 'Wum', 'Nkambé', 'Fundong', 'Bali', 'Bafut', 'Oku', 'Ndop', 'Kumbo', 'Batibo'],
  'Sud-Ouest': ['Limbe', 'Buea', 'Tiko', 'Muea', 'Fako', 'Mbonge', 'Buea', 'Limbe II', 'Muea', 'Limbe'],
  'Extrême-Nord': ['Kousseri', 'Yagoua', 'Maroua', 'Kaélé', 'Moulvoudaye', 'Kolofata', 'Mora', 'Roua', 'Pétévo', 'Waza'],
  'Adamaoua': ['Ngaoundéré', 'Banyo', 'Tignère', 'Vina', 'Djohong', 'Gbaya', 'Bouba', 'Mbere', 'Mayo-Baléo', 'Tibati'],
  'Est': ['Belabo', 'Bertoua', 'Gari-Gombo', 'Lomié', 'Kentzé', 'Batouri', 'Abong-Mbang', 'Nguélémendouka', 'Yokadouma', 'Ngoura']
};

const allLocations = Object.entries(regions).flatMap(([region, cities]) => 
  cities.map(city => ({ label: `${city}, ${region}`, value: city }))
);

const MAX_VISIBLE_RESULTS = 10;

// Fonction pour normaliser les chaînes de caractères (enlever les accents)
const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [visibleResults, setVisibleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setLoading(true);

    if (value) {
      const normalizedValue = normalizeString(value);
      const filtered = allLocations.filter(({ label }) =>
        normalizeString(label).includes(normalizedValue)
      );
      setFilteredLocations(filtered);
      setVisibleResults(filtered.slice(0, MAX_VISIBLE_RESULTS));
      setShowAll(false);
    } else {
      setFilteredLocations([]);
      setVisibleResults([]);
    }
    
    setLoading(false);
  };

  const handleShowAll = () => {
    setVisibleResults(filteredLocations);
    setShowAll(true);
  };

  const handleSelectLocation = (location) => {
    setSearchTerm(location);
    setFilteredLocations([]);
    setVisibleResults([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <IconSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
        <TextInput
          type="search"
          placeholder="Rechercher une ville ou une région..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10"
        />
        {loading && (
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
      {filteredLocations.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          {visibleResults.map(({ label }, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectLocation(label)}
            >
              {label}
            </li>
          ))}
          {filteredLocations.length > MAX_VISIBLE_RESULTS && !showAll && (
            <li
              className="px-4 py-2 text-blue-500 cursor-pointer hover:bg-gray-100"
              onClick={handleShowAll}
            >
              Voir plus
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
