import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ activeSearchCategory, setActiveSearchCategory, setSearchQuery }) => {
    const [query, setQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(history);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            const newHistory = [query, ...searchHistory.slice(0, 9)];
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
            navigate(`/dashboard/results?query=${encodeURIComponent(query)}`);
            setIsDropdownVisible(false);
        }
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
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
                            />
                        </svg>
                    </span>
                    <input
                        type="search"
                        className="w-[450px] border-1 rounded-3xl py-2 pl-10 pr-3 dark:bg-gray-800 border-gray-400 focus:ring-0 focus:border-1 sm:text-sm"
                        placeholder="Rechercher un texte juridique..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsDropdownVisible(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={handleSearch}
                    >
                        <svg
                            className="w-5 h-5 text-gray-600 dark:text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M10 19L16.2386 12.2386C16.4574 11.9529 16.4574 11.0471 16.2386 10.7614L10 1.76142V19ZM15.2386 10.7614C15.4574 11.0471 15.4574 11.9529 15.2386 12.2386L10 19L1.76142 12.2386C1.45736 11.9529 1.45736 11.0471 1.76142 10.7614L10 1.76142L15.2386 10.7614Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                {/* Dropdown d'historique de recherche */}
                {isDropdownVisible && searchHistory.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-50 mt-2 w-full max-w-[450px] border border-gray-200 rounded-lg shadow-lg dark:bg-dark-background bg-white"
                    >
                        <div className="flex justify-between items-center p-2">
                            <span className="font-semibold text-gray-600">Recherches récentes</span>
                            <button
                                className="font-normal underline"
                                onClick={() => {
                                    navigate('/dashboard/recherche/historique');
                                    setIsDropdownVisible(false);
                                }}
                            >
                                Voir tout
                            </button>
                        </div>
                        <ul className="max-h-48 overflow-y-auto">
                            {searchHistory.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-2 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-200"
                                    onClick={() => {
                                        setQuery(item);
                                        handleSearch(new Event('submit'));
                                    }}
                                >
                                        {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Recherche pour écran petit */}
            <div className="block mx-4 md:hidden">
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
                            />
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="w-full border-1 rounded-3xl py-2 pl-10 pr-3 dark:bg-gray-800 text-gray-700 focus:ring-0 focus:border-1 sm:text-sm"
                        placeholder="Rechercher..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsDropdownVisible(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={handleSearch}
                    >
                        <svg
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M10 19L16.2386 12.2386C16.4574 11.9529 16.4574 11.0471 16.2386 10.7614L10 1.76142V19ZM15.2386 10.7614C15.4574 11.0471 15.4574 11.9529 15.2386 12.2386L10 19L1.76142 12.2386C1.45736 11.9529 1.45736 11.0471 1.76142 10.7614L10 1.76142L15.2386 10.7614Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
