import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const ImportComments = () => {
    const [comments, setComments] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState({});
    const [selectedDecisions, setSelectedDecisions] = useState({});
    const [selectedLegislations, setSelectedLegislations] = useState({});
    const [articles, setArticles] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [legislations, setLegislations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/articles');
                const decisionsRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions');
                const legislationsRes = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/legislations');
                setArticles(articlesRes.data.map(item => ({ value: item.id, label: item.title.rendered })));
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
                if (fields.length >= 3) {
                    const Title = fields[0].replace(/(^"|"$)/g, '').trim();
                    const Content = fields[1].replace(/(^"|"$)/g, '').trim();
                    const URL = fields[2].replace(/(^"|"$)/g, '').trim();
                    if (Title && Content && URL) {
                        return { Title, Content, URL };
                    }
                }
                return null;
            }).filter(Boolean);
            setComments(result);
        };
        reader.readAsText(file);
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');

        comments.forEach(comment => {
            const articleID = selectedArticles[comment.Title]?.value;
            const decisionID = selectedDecisions[comment.Title]?.value;
            const legislationID = selectedLegislations[comment.Title]?.value;

            axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/commentaires', {
                title: comment.Title,
                content: comment.Content,
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
            }).then(response => {
                console.log('Comment saved:', response.data);
            }).catch(error => {
                console.error('Error saving comment:', error);
            });
        });
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
            {comments.length > 0 && (
                <div>
                    {comments.map((comment, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">{comment.Title}</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Article:</label>
                                <Select
                                    options={articles}
                                    onChange={(selectedOption) => setSelectedArticles(prev => ({ ...prev, [comment.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Decision:</label>
                                <Select
                                    options={decisions}
                                    onChange={(selectedOption) => setSelectedDecisions(prev => ({ ...prev, [comment.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Legislation:</label>
                                <Select
                                    options={legislations}
                                    onChange={(selectedOption) => setSelectedLegislations(prev => ({ ...prev, [comment.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImportComments;
