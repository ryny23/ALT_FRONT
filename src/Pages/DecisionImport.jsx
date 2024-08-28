import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const DecisionImport = () => {
    const [articles, setArticles] = useState([]);
    const [selectedCommentaires, setSelectedCommentaires] = useState({});
    const [selectedArticles, setSelectedArticles] = useState({});
    const [selectedLegislations, setSelectedLegislations] = useState({});
    const [commentaires, setCommentaires] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [legislations, setLegislations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentairesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires');
                const articlesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/articles');
                const legislationsRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations');
                setCommentaires(commentairesRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
                setArticles(articlesRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
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
                if (fields.length >= 3) {
                    const Title = fields[0].replace(/(^"|"$)/g, '').trim();
                    const Content = fields[1].replace(/(^"|"$)/g, '').trim();
                    const resume = fields[2].replace(/(^"|"$)/g, '').trim();
                    const information = fields[3].replace(/(^"|"$)/g, '').trim();
                    if (Title && Content && resume && information) {
                        return { Title, Content, resume, information };
                    }
                }
                return null;
            }).filter(Boolean);
            setDecisions(result);
        };
        reader.readAsText(file);
    };

    const handleSave = () => {
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('token');

        const promises = decisions.map(decision => {
            const commentID = selectedCommentaires[decision.Title]?.value;
            const articleID = selectedArticles[decision.Title]?.value;
            const legislationID = selectedLegislations[decision.Title]?.value;

            return axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions', {
                title: decision.Title,
                content: decision.Content,
                acf: {
                    commentaire: commentID,
                    article: articleID,
                    legislation: legislationID,
                    resume: decision.resume,
                    information: decision.information,
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
        });

        Promise.all(promises)
            .then(() => {
                setMessage('Decisions importé avec succes!');
                setLoading(false);
            })
            .catch((error) => {
                setMessage('Error importing decisions. Please try again.');
                setLoading(false);
                console.error('Error saving decisions:', error);
            });
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
            {decisions.length > 0 && (
                <div>
                    {decisions.map((decision, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">{decision.Title}</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Commentaires:</label>
                                <Select
                                    options={commentaires}
                                    onChange={(selectedOption) => setSelectedCommentaires(prev => ({ ...prev, [decision.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Articles:</label>
                                <Select
                                    options={articles}
                                    onChange={(selectedOption) => setSelectedArticles(prev => ({ ...prev, [decision.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Legislation:</label>
                                <Select
                                    options={legislations}
                                    onChange={(selectedOption) => setSelectedLegislations(prev => ({ ...prev, [decision.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    {message && <p className={`mt-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
                </div>
            )}
        </div>
    );
};

export default DecisionImport;
