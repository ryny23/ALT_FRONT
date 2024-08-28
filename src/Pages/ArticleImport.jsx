import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const ArticleImport = () => {
    const [articles, setArticles] = useState([]);
    const [selectedCommentaires, setSelectedCommentaires] = useState({});
    const [selectedDecisions, setSelectedDecisions] = useState({});
    const [selectedLegislations, setSelectedLegislations] = useState({});
    const [commentaires, setCommentaires] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [legislations, setLegislations] = useState([]);

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
                if (fields.length >= 3) {
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
        const token = localStorage.getItem('token');

        articles.forEach(article => {
            const commentID = selectedCommentaires[article.Title]?.value;
            const decisionID = selectedDecisions[article.Title]?.value;
            const legislationID = selectedLegislations[article.Title]?.value;

            axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/articles', {
                title: article.Title,
                content: article.Content,
                acf: {
                    commentaire: commentID,
                    decision: decisionID,
                    Legislation_ou_titre_ou_chapitre_ou_section: legislationID,
                    
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                console.log('Article saved:', response.data);
            }).catch(error => {
                console.error('Error saving article:', error);
            });
        });
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
            {articles.length > 0 && (
                <div>
                    {articles.map((article, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">{article.Title}</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Commentaires:</label>
                                <Select
                                    options={commentaires}
                                    onChange={(selectedOption) => setSelectedCommentaires(prev => ({ ...prev, [article.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Decision:</label>
                                <Select
                                    options={decisions}
                                    onChange={(selectedOption) => setSelectedDecisions(prev => ({ ...prev, [article.Title]: selectedOption }))}
                                    isClearable
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Map Legislation:</label>
                                <Select
                                    options={legislations}
                                    onChange={(selectedOption) => setSelectedLegislations(prev => ({ ...prev, [article.Title]: selectedOption }))}
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

export default ArticleImport;
