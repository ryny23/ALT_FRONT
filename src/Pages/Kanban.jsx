import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Kanban = ({ article, legislationID, selectedCommentaire, selectedDecision }) => {
    const [legislationItems, setLegislationItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const endpoints = ['titres', 'chapitres', 'sections', 'articles'];

    useEffect(() => {
        const fetchLegislationItems = async () => {
            try {
                const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${legislationID}`);
                const identifiers = res.data.acf.titre_ou_chapitre_ou_section_ou_articles;

                const fetchData = async (id) => {
                    for (let endpoint of endpoints) {
                        try {
                            const res = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/${endpoint}/${id}`);
                            if (res.data) return { ...res.data, endpoint };
                        } catch (err) {
                            // Continue to the next endpoint if not found
                        }
                    }
                    return null;
                };

                const detailsData = await Promise.all(identifiers.map(fetchData));
                const successfulItems = detailsData.filter(item => item !== null);
                setLegislationItems(successfulItems);
            } catch (err) {
                setError('Failed to fetch legislation items');
            } finally {
                setLoading(false);
            }
        };

        if (legislationID) {
            fetchLegislationItems();
        }
    }, [legislationID]);

    const handleSave = async () => {
        if (!selectedItem) {
            alert('Veuillez sélectionner un élément de la législation.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
    
            // Extraire les ID des sélections multiples si disponibles
            const commentairesIDs = selectedCommentaire && selectedCommentaire.length > 0
                ? selectedCommentaire.map(commentaire => commentaire.value)
                : [];
            const decisionsIDs = selectedDecision && selectedDecision.length > 0
                ? selectedDecision.map(decision => decision.value)
                : [];
    
            // Construire l'objet de données en incluant les champs ACF seulement s'ils ne sont pas vides
            const articleData = {
                title: article.Title,
                content: article.Content,
                status: 'publish',
                acf: {
                    legislation: legislationID,
                    ...(commentairesIDs.length > 0 && { commentaire: commentairesIDs }),  // Inclure seulement si non vide
                    ...(decisionsIDs.length > 0 && { decision: decisionsIDs }),        // Inclure seulement si non vide
                }
            };
    
            console.log('Article Data:', articleData);
    
            // Post the article to WordPress
            const response = await axios.post(`https://alt.back.qilinsa.com/wp-json/wp/v2/articles`, articleData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            const newArticleID = response.data.id;
    
            // Find the index of the selected item
            const selectedIndex = legislationItems.findIndex(item => item.id === selectedItem.id);
    
            if (selectedIndex === -1) {
                alert('Selected item not found in legislation items.');
                return;
            }
    
            // Insert the new article ID right after the selected item
            const updatedIdentifiers = [
                ...legislationItems.slice(0, selectedIndex + 1).map(item => item.id),
                newArticleID,
                ...legislationItems.slice(selectedIndex + 1).map(item => item.id),
            ];
    
            console.log('Updated Identifiers:', updatedIdentifiers);
    
            // Update the legislation with the new items list
            await axios.post(`https://alt.back.qilinsa.com/wp-json/wp/v2/legislations/${legislationID}`, {
                acf: {
                    titre_ou_chapitre_ou_section_ou_articles: updatedIdentifiers
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            alert('Article ajouté et ordre mis à jour avec succès !');
        } catch (error) {
            console.error('Échec de la mise à jour de l\'ordre :', error.response?.data || error.message);
            alert('Échec de la mise à jour de l\'ordre');
        }
    };
    
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="flex">
                <div className="p-4 w-1/2 bg-gray-200 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">Éléments de la législation</h3>
                    <ul>
                        {legislationItems.map((item) => (
                            <li 
                                key={item.id} 
                                className={`p-2 mb-2 bg-white rounded-lg shadow cursor-pointer ${
                                    selectedItem?.id === item.id ? 'bg-blue-300 border-2 border-blue-500' : ''
                                }`}
                                onClick={() => setSelectedItem(item)}
                            >
                                {item.title?.rendered || item.post_title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-4 w-1/2 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">Article à Mapper</h3>
                    <div className="p-2 mb-2 bg-white rounded-lg shadow">
                        {article.Title}
                    </div>
                </div>
            </div>
            <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
            >
                Save Order
            </button>
        </>
    );
};

export default Kanban;
