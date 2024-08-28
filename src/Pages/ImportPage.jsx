import React, { useState } from 'react';
import ImportComments from './CommentImport';
import ArticleImport from './ArticleImport';
import ImportDecisions from './DecisionImport';

const ImportPage = () => {
    const [selectedImportType, setSelectedImportType] = useState('');

    const handleImportTypeChange = (event) => {
        setSelectedImportType(event.target.value);
    };

    const renderImportComponent = () => {
        switch (selectedImportType) {
            case 'comments':
                return <ImportComments />;
            case 'articles':
                return <ArticleImport />;
            case 'decisions':
                return <ImportDecisions />;
            default:
                return <div>Veillez choisir le type d'import.</div>;
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Import de données</h1>
            <select 
                value={selectedImportType}
                onChange={handleImportTypeChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                <option value="">selectionner import</option>
                <option value="comments">Import Commentaires</option>
                <option value="articles">Import Articles</option>
                <option value="decisions">Import Decisions</option>
            </select>

            <div className="mt-4">
                {renderImportComponent()}
            </div>
        </div>
    );
};

export default ImportPage;
