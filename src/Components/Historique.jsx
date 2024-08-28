import React, { useEffect, useState } from 'react';

const Historique = () => {
    const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || []);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        // Ajouter un listener pour détecter les changements dans le stockage local
        window.addEventListener('storage', () => {
            const newHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
            setSearchHistory(newHistory);
        });
        return () => {
            window.removeEventListener('storage', () => {});
        };
    }, []);

    const handleClearAll = () => {
        localStorage.removeItem('searchHistory');
        setSearchHistory([]);
        window.location.reload(); // Rafraîchir la page après avoir effacé tout
    };

    const handleClearOne = (index) => {
        const newHistory = searchHistory.filter((item, i) => i !== index);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        setSearchHistory(newHistory);
        window.location.reload(); // Rafraîchir la page après avoir supprimé un élément
    };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchHistory.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="pt-10 px-36">
            <h1 className="text-2xl font-bold mb-4">Historique de Recherche</h1>
            {searchHistory.length > 0 ? (
                <div className="flex flex-col">
                    <button className="text-red-500 text-right mb-4 mr20 underline" onClick={handleClearAll}>Effacer tout</button>
                    <ul className="space-y-2">
                        {currentItems.map((item, index) => (
                            <li key={index} className="flex justify-between p-2 border-b border-gray-200">
                                {item}
                                <button className="text-gray-600 text-right" onClick={() => handleClearOne(index + indexOfFirstItem)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-500">Aucune recherche récente</p>
            )}
        </div>
    );
};

export default Historique;
