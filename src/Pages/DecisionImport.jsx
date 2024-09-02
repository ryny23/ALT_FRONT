import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Papa from 'papaparse';

const DecisionImport = () => {
    const [decisions, setDecisions] = useState([]);
    const [selectedCommentaires, setSelectedCommentaires] = useState({});
    const [selectedArticles, setSelectedArticles] = useState({});
    const [selectedLegislations, setSelectedLegislations] = useState({});
    const [commentaires, setCommentaires] = useState([]);
    const [articles, setArticles] = useState([]);
    const [legislations, setLegislations] = useState([]);
    const [selectedDecisions, setSelectedDecisions] = useState([]);
    const [expandedDecision, setExpandedDecision] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentairesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires');
                const articlesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/articles');
                const legislationsRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations');
    
                const legislationsMap = legislationsRes.data.reduce((map, legislation) => {
                    map[legislation.id] = legislation.title.rendered;
                    return map;
                }, {});
    
                const articlesWithLegislation = await Promise.all(articlesRes.data.map(async (article) => {
                    const legislationId = article.acf?.Legislation_ou_titre_ou_chapitre_ou_section;
                    const legislationTitle = legislationsMap[legislationId] || 'Unknown Legislation';
                    return {
                        value: article.id,
                        label: `${article.title.rendered} - ${legislationTitle}`
                    };
                }));
    
                setCommentaires(commentairesRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
                setArticles(articlesWithLegislation);
                setLegislations(legislationsRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const requiredFields = ['Title', 'Content', 'Resume', 'Information'];
                const parsedData = results.data;
    
                // Check if all required fields are present in the first row
                const missingFields = requiredFields.filter(field => !Object.keys(parsedData[0]).includes(field));
                
                if (missingFields.length > 0) {
                    console.error(`Missing fields in the CSV: ${missingFields.join(', ')}`);
                    alert(`Error: The following fields are missing in the CSV file: ${missingFields.join(', ')}`);
                    return;
                }
    
                const validData = parsedData.map(row => ({
                    Title: row.Title ? row.Title.trim() : '',
                    Content: row.Content ? row.Content.trim() : '',
                    resume: row.Resume ? row.Resume.trim() : '',
                    information: row.Information ? row.Information.trim() : ''
                })).filter(row => row.Title && row.Content && row.resume && row.information);
    
                setDecisions(validData);
            },
            error: function(error) {
                console.error('Error parsing CSV file:', error);
            }
        });
    };
    

    const handleSave = () => {
        setLoading(true);
        setMessage(null);
        const token = localStorage.getItem('token');

        const promises = selectedDecisions.map(decisionTitle => {
            const decision = decisions.find(d => d.Title === decisionTitle);

            const commentIDs = (selectedCommentaires[decision.Title] || []).map(comment => comment.value);
            const articleIDs = (selectedArticles[decision.Title] || []).map(article => article.value);
            const legislationID = selectedLegislations[decision.Title]?.value;

            const data = {
                title: decision.Title,
                content: decision.Content,
                status: 'publish',
                acf: {
                    resume: decision.resume,
                    information: decision.information,
                }
            };

            if (commentIDs.length > 0) data.acf.commentaire = commentIDs;
            if (articleIDs.length > 0) data.acf.article = articleIDs;
            if (legislationID) data.acf.legislation = legislationID;

            return axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
        });

        Promise.all(promises)
            .then((responses) => {
                setLoading(false);
                setMessage({ type: 'success', text: 'Decisions imported successfully!' });
                console.log('Decisions saved:', responses.map(response => response.data));
            })
            .catch((error) => {
                setLoading(false);
                setMessage({ type: 'error', text: 'Error saving decisions. Please try again.' });
                console.error('Error saving decisions:', error);
            });
    };

    const handleDecisionClick = (title) => {
        setExpandedDecision(expandedDecision === title ? null : title);
    };

    const handleSelectDecision = (title) => {
        setSelectedDecisions(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedDecisions([]);
        } else {
            setSelectedDecisions(decisions.map(decision => decision.Title));
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Import Decisions</h1>
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

            {decisions.length > 0 && (
                <div>
                    <button
                        onClick={handleSelectAll}
                        className="px-4 py-2 mb-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
                    >
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </button>
                    {decisions.map((decision, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDecisions.includes(decision.Title)}
                                    onChange={() => handleSelectDecision(decision.Title)}
                                    className="mr-2"
                                />
                                <h3
                                    className="text-xl font-semibold cursor-pointer"
                                    onClick={() => handleDecisionClick(decision.Title)}
                                >
                                    {decision.Title}
                                </h3>
                            </div>
                            {expandedDecision === decision.Title && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Commentaire:</label>
                                        <Select
                                            options={commentaires}
                                            value={selectedCommentaires[decision.Title] || null}
                                            onChange={(selectedOption) => setSelectedCommentaires(prev => ({ ...prev, [decision.Title]: selectedOption }))}
                                            isClearable
                                            isMulti
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Article:</label>
                                        <Select
                                            options={articles}
                                            value={selectedArticles[decision.Title] || null}
                                            onChange={(selectedOption) => setSelectedArticles(prev => ({ ...prev, [decision.Title]: selectedOption }))}
                                            isClearable
                                            isMulti
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Legislation:</label>
                                        <Select
                                            options={legislations}
                                            value={selectedLegislations[decision.Title] || null}
                                            onChange={(selectedOption) => setSelectedLegislations(prev => ({ ...prev, [decision.Title]: selectedOption }))}
                                            isClearable
                                            className="w-full"
                                        />
                                    </div>
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

export default DecisionImport;
