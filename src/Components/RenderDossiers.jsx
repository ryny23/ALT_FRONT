import React, { useState, useEffect } from 'react';

const RenderDossiers = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const renameFolder = () => {
        const newName = prompt("Entrez le nouveau nom du dossier:");
        if (newName) {
            alert(`Le dossier a été renommé en: ${newName}`);
            // Ici, tu mettrais à jour le nom du dossier dans ton backend ou ton état
        }
    };

    const deleteFolder = () => {
        const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce dossier?");
        if (confirmation) {
            alert("Le dossier a été supprimé.");
            // Ici, tu supprimerais le dossier dans ton backend ou ton état
        }
    };

    // Ferme le menu déroulant si l'utilisateur clique à l'extérieur
    const handleClickOutside = (e) => {
        const menu = document.getElementById('dropdownMenu');
        const button = document.getElementById('dropdownButton');
        if (!button.contains(e.target) && !menu.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    // Utilise un effet pour ajouter et supprimer l'écouteur d'événement
    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <h1 className="text-6xl font-semibold text-center">Dossiers</h1>
                <button className="bg-green-500 text-white p-2 rounded-lg mt-2 hover:bg-primary/80 w-full">Créer un dossier</button>
                <div className="mt-4 border-t border-border pt-2 text-center">
                    <div className="relative inline-block text-left mt-2">
                        <button 
                            id="dropdownButton" 
                            className="bg-secondary hover:text-green-500 text-secondary-foreground p-2 rounded-lg hover:bg-secondary/80"
                            onClick={toggleDropdown}
                        >
                            À classer
                        </button>
                        <div 
                            id="dropdownMenu" 
                            className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 ${isDropdownOpen ? '' : 'hidden'}`}
                        >
                            <div className="py-1" role="menu">
                                <button 
                                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted" 
                                    role="menuitem" 
                                    onClick={renameFolder}
                                >
                                    Renommer
                                </button>
                                <button 
                                    className="block px-4 py-2 text-sm text-destructive hover:bg-destructive/80" 
                                    role="menuitem" 
                                    onClick={deleteFolder}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RenderDossiers;