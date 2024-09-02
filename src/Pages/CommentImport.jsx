import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Papa from 'papaparse';

const ImportComments = () => {
    const [comments, setComments] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState({});
    const [selectedDecisions, setSelectedDecisions] = useState({});
    const [selectedLegislations, setSelectedLegislations] = useState({});
    const [articles, setArticles] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [legislations, setLegislations] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [expandedComment, setExpandedComment] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/articles');
                const decisionsRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions');
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

                setArticles(articlesWithLegislation);
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
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const requiredFields = ['Title', 'Content', 'URL'];
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
                    URL: row.URL ? row.URL.trim() : ''
                })).filter(row => row.Title && row.Content && row.URL);

                setComments(validData);
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

        const promises = comments
            .filter(comment => selectedComments.includes(comment.Title))
            .map(comment => {
                const articleID = selectedArticles[comment.Title]?.value;
                const decisionID = selectedDecisions[comment.Title]?.value;
                const legislationID = selectedLegislations[comment.Title]?.value;

                return axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires', {
                    title: comment.Title,
                    content: comment.Content,
                    status: 'publish',
                    acf: {
                        article: articleID,
                        decision: decisionID,
                        legislation: legislationID,
                        url: comment.URL,
                    }
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            });

        Promise.all(promises)
            .then((responses) => {
                setLoading(false);
                setMessage({ type: 'success', text: 'Comments imported successfully!' });
                console.log('Comments saved:', responses.map(response => response.data));
            })
            .catch((error) => {
                setLoading(false);
                setMessage({ type: 'error', text: 'Error saving comments. Please try again.' });
                console.error('Error saving comments:', error);
            });
    };

    const handleCommentClick = (title) => {
        setExpandedComment(expandedComment === title ? null : title);
    };

    const handleSelectComment = (title) => {
        setSelectedComments(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedComments([]);
        } else {
            setSelectedComments(comments.map(comment => comment.Title));
        }
        setSelectAll(!selectAll);
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Import Commentaires</h1>
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

            {comments.length > 0 && (
                <div>
                    <button
                        onClick={handleSelectAll}
                        className="px-4 py-2 mb-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
                    >
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </button>
                    {comments.map((comment, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedComments.includes(comment.Title)}
                                    onChange={() => handleSelectComment(comment.Title)}
                                    className="mr-2"
                                />
                                <h3
                                    className="text-xl font-semibold cursor-pointer"
                                    onClick={() => handleCommentClick(comment.Title)}
                                >
                                    {comment.Title}
                                </h3>
                            </div>
                            {expandedComment === comment.Title && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Article:</label>
                                        <Select
                                            options={articles}
                                            value={selectedArticles[comment.Title] || null}
                                            onChange={(selectedOption) => setSelectedArticles(prev => ({ ...prev, [comment.Title]: selectedOption }))}
                                            isClearable
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Decision:</label>
                                        <Select
                                            options={decisions}
                                            value={selectedDecisions[comment.Title] || null}
                                            onChange={(selectedOption) => setSelectedDecisions(prev => ({ ...prev, [comment.Title]: selectedOption }))}
                                            isClearable
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Map Legislation:</label>
                                        <Select
                                            options={legislations}
                                            value={selectedLegislations[comment.Title] || null}
                                            onChange={(selectedOption) => setSelectedLegislations(prev => ({ ...prev, [comment.Title]: selectedOption }))}
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
                </div>
            )}
        </div>
    );
};

export default ImportComments;
