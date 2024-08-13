import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Fetch location suggestions from API
  const fetchLocationSuggestions = async (query) => {
    setLoadingSuggestions(true);
    try {
      const response = await axios.get(`https://api.cameroun-cities.com/v1/autocomplete?query=${query}`);
      setLocationSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchLocationSuggestions(searchTerm);
    } else {
      setLocationSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className="relative max-w-xl mx-auto mt-10">
      <input
        type="text"
        placeholder="Rechercher une annonce..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loadingSuggestions && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}
      {locationSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {locationSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setSearchTerm(suggestion.name);
                setLocationSuggestions([]);
              }}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
      <button className="absolute right-0 top-0 mt-2 mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Rechercher
      </button>
    </div>
  );
};

export default SearchBar;
