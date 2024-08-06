
import { useState } from 'react';
import { HiFolder } from 'react-icons/hi'; // Utilisation d'une icône moderne

export default function Widget() {
    // État pour la gestion du bouton actif
    const [activeButton, setActiveButton] = useState('Tout');

    // Fonction pour gérer les clics sur les boutons de filtrage
    const handleButtonClick = (label) => {
        setActiveButton(label);
    };

    return (
        <div className="min-h-screen pl-8 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4">Alertes</h1>
            <div className="flex space-x-2 mb-4">
                {['Tout', 'Mots-clés', 'Entreprises', 'Avocats', 'Dossiers', 'Lois et règlements', 'Lois en discussion', 'Commentaires'].map((label) => (
                    <button
                        key={label}
                        className={`px-4 py-2 rounded ${activeButton === label ? 'bg-blue-500 text-white' : 'border border-zinc-300'}`}
                        onClick={() => handleButtonClick(label)}
                        aria-label={`Filtrer par ${label}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex items-center mb-4">
                <HiFolder className="text-xl" aria-hidden="true" /> {/* Utilisation de l'icône React */}
                <span className="ml-2 font-semibold">À classer</span>
            </div>

            <div className="flex space-x-4 mb-4">
                {['Décisions', 'Commentaires'].map((label) => (
                    <button
                        key={label}
                        className="border border-zinc-300 px-4 py-2 rounded"
                        aria-label={`Filtrer par ${label}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="bg-muted p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold">Gardez toujours une longueur d’avance.</h2>
                <p className="text-muted-foreground">
                    Pour recevoir vos décisions ou commentaires pertinents au fil de l’eau, créez des alertes à partir de vos recherches par mots-clés ou suivez des entreprises, des avocats et des cabinets.
                </p>
            </div>

            <div className="border-l border-zinc-300 pl-4">
                <h3 className="font-semibold mb-2">Avocats à suivre</h3>
                <ul>
                    {['Arnaud CLERC', 'Fabrice BERNARD', 'Yasmina GOUDJIL', 'Christophe RUFFEL', 'Olivier DESCAMPS'].map((avocat) => (
                        <li key={avocat} className="flex justify-between items-center mb-2">
                            <span>{avocat}</span>
                            <button
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded"
                                aria-label={`Créer une alerte pour ${avocat}`}
                            >
                                Créer
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
