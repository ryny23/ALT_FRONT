import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
    const [groupImport, setGroupImport] = useState(false); // Nouvelle option pour import groupé
    const [groupMapping, setGroupMapping] = useState({
        commentaires: [],
        articles: [],
        legislation: null,
    });
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

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

                // Map the data with IDs (ID_articles, ID_commentaires, ID_legislation)
                const validData = parsedData.map(row => {
                    const mappedArticles = row.ID_articles ? row.ID_articles.split(',').map(id => articles.find(article => article.value === parseInt(id))) : [];
                    const mappedCommentaires = row.ID_commentaires ? row.ID_commentaires.split(',').map(id => commentaires.find(comment => comment.value === parseInt(id))) : [];
                    const mappedLegislation = row.ID_legislation ? legislations.find(leg => leg.value === parseInt(row.ID_legislation)) : null;

                    return {
                        Title: row.Title ? row.Title.trim() : '',
                        Content: row.Content ? row.Content.trim() : '',
                        resume: row.Resume ? row.Resume.trim() : '',
                        information: row.Information ? row.Information.trim() : '',
                        mappedArticles,
                        mappedCommentaires,
                        mappedLegislation
                    };
                }).filter(row => row.Title && row.Content && row.resume && row.information);
    
                setDecisions(validData);

                // Automatically set selected fields based on IDs from the CSV
                const newSelectedArticles = {};
                const newSelectedCommentaires = {};
                const newSelectedLegislations = {};

                validData.forEach(decision => {
                    newSelectedArticles[decision.Title] = decision.mappedArticles || [];
                    newSelectedCommentaires[decision.Title] = decision.mappedCommentaires || [];
                    newSelectedLegislations[decision.Title] = decision.mappedLegislation || null;
                });

                setSelectedArticles(newSelectedArticles);
                setSelectedCommentaires(newSelectedCommentaires);
                setSelectedLegislations(newSelectedLegislations);
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

            let commentIDs, articleIDs, legislationID;
            
            if (groupImport) {
                // Use group mapping
                commentIDs = groupMapping.commentaires.map(comment => comment.value);
                articleIDs = groupMapping.articles.map(article => article.value);
                legislationID = groupMapping.legislation?.value;
            } else {
                // Use individual mappings
                commentIDs = (selectedCommentaires[decision.Title] || []).map(comment => comment.value);
                articleIDs = (selectedArticles[decision.Title] || []).map(article => article.value);
                legislationID = selectedLegislations[decision.Title]?.value;
            }

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
            })
            .catch((error) => {
                setLoading(false);
                setMessage({ type: 'error', text: 'Error saving decisions. Please try again.' });
            });
    };

    const handleDecisionClick = (title) => {
        if (!groupImport) {
            setExpandedDecision(expandedDecision === title ? null : title);
        }
        
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

    // Function to export data to CSV
    const exportToCSV = () => {
        const dataToExport = decisions.map(decision => {
            let commentIDs = [];
            let articleIDs = [];
            let legislationID = '';
    
            if (groupImport) {
                // Use group mapping
                commentIDs = groupMapping.commentaires.map(comment => comment.value);
                articleIDs = groupMapping.articles.map(article => article.value);
                legislationID = groupMapping.legislation?.value || '';
            } else {
                articleIDs = (selectedArticles[decision.Title] || []).map(article => article.value).join(',');
                commentIDs = (selectedCommentaires[decision.Title] || []).map(comment => comment.value).join(',');
                legislationID = selectedLegislations[decision.Title]?.value || '';
            }
    
            return {
                Title: decision.Title,
                Content: decision.Content,
                Resume: decision.resume,
                Information: decision.information,
                ID_articles: articleIDs,
                ID_commentaires: commentIDs,
                ID_legislation: legislationID
            };
        });
    
        const csv = Papa.unparse(dataToExport);
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'DecisionsExport.csv');
        link.click();
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
                    
                    {/* Option pour activer l'import groupé */}
            <div className="mb-4">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={groupImport}
                        onChange={() => setGroupImport(!groupImport)}
                        className="form-checkbox"
                    />
                    <span className="ml-2">Activer l'import groupé</span>
                </label>
            </div>
            

            {groupImport && (
                <div>
                    {/* Sélecteurs pour le mappage groupé */}
                    <Select
                        isMulti
                        options={commentaires}
                        value={groupMapping.commentaires}
                        onChange={(selected) => setGroupMapping({ ...groupMapping, commentaires: selected })}
                        placeholder="Select Commentaires"
                        className="mt-2"
                    />
                    <Select
                        isMulti
                        options={articles}
                        value={groupMapping.articles}
                        onChange={(selected) => setGroupMapping({ ...groupMapping, articles: selected })}
                        placeholder="Select Articles"
                        className="mt-2"
                    />
                    <Select
                        options={legislations}
                        value={groupMapping.legislation}
                        onChange={(selected) => setGroupMapping({ ...groupMapping, legislation: selected })}
                        placeholder="Select Legislation"
                        className="mt-2"
                    />
                </div>
            )}
            <div className='mt-4'></div>
            <button
                        onClick={handleSelectAll}
                        className="px-4 py-2 mb-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
                    >
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </button>
            <div className='mt-4'></div>
                    {decisions.map((decision, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDecisions.includes(decision.Title)}
                                    onChange={() => handleSelectDecision(decision.Title)}
                                    
                                    className="mr-2"
                                />
                                <h2
                                    className="text-xl font-semibold cursor-pointer"
                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
                                    onClick={() => handleDecisionClick(decision.Title)}
                                    
                                    
                                >
                                    {decision.Title}
                                    <FontAwesomeIcon 
                    icon={isExpanded ? faChevronUp : faChevronDown} 
                    style={{ marginRight: '8px' }} 
                />
                                    
                                </h2>
                            </div>
                            
                            {expandedDecision === decision.Title && !groupImport && (
                                <div>
                                    <p><strong>Content:</strong> {decision.Content}</p>
                                    <p><strong>Résumé:</strong> {decision.resume}</p>
                                    <p><strong>Information:</strong> {decision.information}</p>

                                    {/* Dropdowns or inputs for selecting related comments, articles, and legislations */}
                                    <Select
                                        isMulti
                                        options={commentaires}
                                        value={selectedCommentaires[decision.Title] || []}
                                        onChange={(selected) =>
                                            setSelectedCommentaires({
                                                ...selectedCommentaires,
                                                [decision.Title]: selected,
                                            })
                                        }
                                        placeholder="Select Commentaires"
                                        className="mt-2"
                                    />
                                    <Select
                                        isMulti
                                        options={articles}
                                        value={selectedArticles[decision.Title] || []}
                                        onChange={(selected) =>
                                            setSelectedArticles({
                                                ...selectedArticles,
                                                [decision.Title]: selected,
                                            })
                                        }
                                        placeholder="Select Articles"
                                        className="mt-2"
                                    />
                                    <Select
                                        options={legislations}
                                        value={selectedLegislations[decision.Title] || null}
                                        onChange={(selected) =>
                                            setSelectedLegislations({
                                                ...selectedLegislations,
                                                [decision.Title]: selected,
                                            })
                                        }
                                        placeholder="Select Legislation"
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Export to CSV button */}
            <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 mt-4"
            >
                Export to CSV
            </button>
        </div>
    );
};

export default DecisionImport;
