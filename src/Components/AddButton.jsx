import React, { useState } from 'react';
import { TextInput, Dropdown, ListGroup, ListGroupItem } from 'flowbite-react';
import { IconLocation } from '@tabler/icons-react';

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

const ExpertLocationForm = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [summary, setSummary] = useState('');

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setSelectedCity(''); // Reset city when region changes
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setSummary(`${selectedRegion}, ${city}`);
  };

  return (
    <div>
      <form className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Région</label>
            <select
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner une région</option>
              {Object.keys(locations).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
            <select
              id="city"
              value={selectedCity}
              onChange={handleCityChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!selectedRegion}
            >
              <option value="">Sélectionner une ville</option>
              {selectedRegion &&
                locations[selectedRegion].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Résumé</label>
          <input
            type="text"
            id="summary"
            value={summary}
            readOnly
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default ExpertLocationForm;