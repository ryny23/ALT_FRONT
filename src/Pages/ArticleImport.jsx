import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Kanban from './Kanban';

const ArticleImport = () => {
    const [articles, setArticles] = useState([]);
    const [selectedCommentaires, setSelectedCommentaires] = useState({});
    const [selectedDecisions, setSelectedDecisions] = useState({});
    const [selectedLegislations, setSelectedLegislations] = useState({});
    const [commentaires, setCommentaires] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [legislations, setLegislations] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [expandedArticle, setExpandedArticle] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false); // État de chargement
    const [message, setMessage] = useState(null); // Message d'erreur ou de succès

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentairesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires');
                const decisionsRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions');
                const legislationsRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations');
                setCommentaires(commentairesRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
                setDecisions(decisionsRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
                setLegislations(legislationsRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const result = lines.slice(1).map(line => {
                const fields = line.split(',');
                if (fields.length >= 2) {
                    const Title = fields[0].replace(/(^"|"$)/g, '').trim();
                    const Content = fields[1].replace(/(^"|"$)/g, '').trim();
                    
                    if (Title && Content) {
                        return { Title, Content };
                    }
                }
                return null;
            }).filter(Boolean);
            setArticles(result);
        };
        reader.readAsText(file);
    };

    const handleSave = () => {
        setLoading(true);
        setMessage(null);
        const token = localStorage.getItem('token');

        const promises = selectedArticles.map(articleTitle => {
            const article = articles.find(a => a.Title === articleTitle);

            // Extraire les IDs des sélections multiples
            const commentIDs = (selectedCommentaires[article.Title] || []).map(comment => comment.value);
            const decisionIDs = (selectedDecisions[article.Title] || []).map(decision => decision.value);
            const legislationID = selectedLegislations[article.Title]?.value;

            const data = {
                title: article.Title,
                content: article.Content,
                status: 'publish', // Changement pour publier l'article directement
                acf: {}
            };

            // Ajouter uniquement les champs non vides
            if (commentIDs.length > 0) data.acf.commentaire = commentIDs;
            if (decisionIDs.length > 0) data.acf.decision = decisionIDs;
            if (legislationID) data.acf.legislation_ou_titre_ou_chapitre_ou_section = legislationID;

            return axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/articles', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
        });

        Promise.all(promises)
            .then((responses) => {
                setLoading(false);
                setMessage({ type: 'success', text: 'Articles imported successfully!' });
                console.log('Articles saved:', responses.map(response => response.data));
            })
            .catch((error) => {
                setLoading(false);
                setMessage({ type: 'error', text: 'Error saving articles. Please try again.' });
                console.error('Error saving articles:', error);
            });
    };

    const handleArticleClick = (title) => {
        setExpandedArticle(expandedArticle === title ? null : title);
    };

    const handleSelectArticle = (title) => {
        setSelectedArticles(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedArticles([]);
        } else {
            setSelectedArticles(articles.map(article => article.Title));
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Import Articles</h1>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            <button
                        onClick={handleSave}
                        className={`px-4 mx-2 py-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-600`}
                        disabled={loading}
                    >
                        {loading ? 'Importing...' : 'Import'}
            </button>

            {message && (
                <div className={`mb-4 p-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
                    {message.text}
                </div>
            )}

            {articles.length > 0 && (
                <div>
                    <button
                        onClick={handleSelectAll}
                        className="px-4 py-2 mb-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
                    >
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </button>
                    {articles.map((article, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedArticles.includes(article.Title)}
                                    onChange={() => handleSelectArticle(article.Title)}
                                    className="mr-2"
                                />
                                <h3
                                    className="text-xl font-semibold cursor-pointer"
                                    onClick={() => handleArticleClick(article.Title)}
                                >
                                    {article.Title}
                                </h3>
                            </div>
                            {expandedArticle === article.Title && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Commentaire:</label>
                                        <Select
                                            options={commentaires}
                                            value={selectedCommentaires[article.Title] || null}
                                            onChange={(selectedOption) => setSelectedCommentaires(prev => ({ ...prev, [article.Title]: selectedOption }))}
                                            isClearable
                                            isMulti
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Decision:</label>
                                        <Select
                                            options={decisions}
                                            value={selectedDecisions[article.Title] || null}
                                            onChange={(selectedOption) => setSelectedDecisions(prev => ({ ...prev, [article.Title]: selectedOption }))}
                                            isClearable
                                            isMulti
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Legislation:</label>
                                        <Select
                                            options={legislations}
                                            value={selectedLegislations[article.Title] || null}
                                            onChange={(selectedOption) => setSelectedLegislations(prev => ({ ...prev, [article.Title]: selectedOption }))}
                                            isClearable
                                            className="w-full"
                                        />
                                    </div>

                                    {selectedLegislations[article.Title] && (
                                        <Kanban
                                            article={article}
                                            legislationID={selectedLegislations[article.Title].value}
                                            selectedCommentaire={selectedCommentaires[article.Title]}
                                            selectedDecision={selectedDecisions[article.Title]}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-600`}
                        disabled={loading}
                    >
                        {loading ? 'Importing...' : 'Import'}
                    </button>
                    {message && (
                        <div className={`mb-4 p-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
                            {message.text}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArticleImport;
