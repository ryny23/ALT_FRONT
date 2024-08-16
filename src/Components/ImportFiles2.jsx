import { useState } from 'react';

export default function Component() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [postType, setPostType] = useState('');
  const [mapping, setMapping] = useState({
    title: '',
    content: '',
    date: '',
    status: ''
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };

  const handleMappingChange = (e, field) => {
    setMapping({
      ...mapping,
      [field]: e.target.value
    });
  };

  const handleImport = () => {
    console.log('File:', selectedFile);
    console.log('Post Type:', postType);
    console.log('Mapping:', mapping);
    // Here you would handle the CSV import logic
  };

  return (
    <div className="w-full max-w-3xl items-center justify-center shadow-md rounded-md p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Importation simplifiée de données</h2>
        <p className="text-gray-600">Importez facilement des fichiers CSV pour créer du contenu sans accès direct.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Fichier CSV</label>
          <input 
            id="file" 
            type="file" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="post-type" className="block text-sm font-medium text-gray-700">Type de contenu</label>
          <select 
            id="post-type" 
            value={postType} 
            onChange={handlePostTypeChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
          >
            <option value="" disabled>Sélectionnez un type</option>
            <option value="legislation">Législation</option>
            <option value="comment">Commentaire</option>
            <option value="decision">Décision</option>
            <option value="article">Article juridique</option>
          </select>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <label htmlFor="mapping" className="block text-sm font-medium text-gray-700">Mappage des champs</label>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Champ CSV</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Champ WordPress</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">
                <input 
                  type="text" 
                  placeholder="Titre" 
                  value={mapping.title} 
                  onChange={(e) => handleMappingChange(e, 'title')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <select 
                  value={mapping.title} 
                  onChange={(e) => handleMappingChange(e, 'title')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                >
                  <option value="" disabled>Sélectionnez un champ</option>
                  <option value="post_title">Titre de l'article</option>
                  <option value="post_content">Contenu de l'article</option>
                  <option value="post_excerpt">Extrait de l'article</option>
                  <option value="post_date">Date de publication</option>
                  <option value="post_status">Statut de l'article</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <input 
                  type="text" 
                  placeholder="Contenu" 
                  value={mapping.content} 
                  onChange={(e) => handleMappingChange(e, 'content')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <select 
                  value={mapping.content} 
                  onChange={(e) => handleMappingChange(e, 'content')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                >
                  <option value="" disabled>Sélectionnez un champ</option>
                  <option value="post_title">Titre de l'article</option>
                  <option value="post_content">Contenu de l'article</option>
                  <option value="post_excerpt">Extrait de l'article</option>
                  <option value="post_date">Date de publication</option>
                  <option value="post_status">Statut de l'article</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <input 
                  type="text" 
                  placeholder="Date" 
                  value={mapping.date} 
                  onChange={(e) => handleMappingChange(e, 'date')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <select 
                  value={mapping.date} 
                  onChange={(e) => handleMappingChange(e, 'date')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                >
                  <option value="" disabled>Sélectionnez un champ</option>
                  <option value="post_title">Titre de l'article</option>
                  <option value="post_content">Contenu de l'article</option>
                  <option value="post_excerpt">Extrait de l'article</option>
                  <option value="post_date">Date de publication</option>
                  <option value="post_status">Statut de l'article</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <input 
                  type="text" 
                  placeholder="Statut" 
                  value={mapping.status} 
                  onChange={(e) => handleMappingChange(e, 'status')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <select 
                  value={mapping.status} 
                  onChange={(e) => handleMappingChange(e, 'status')}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                >
                  <option value="" disabled>Sélectionnez un champ</option>
                  <option value="post_title">Titre de l'article</option>
                  <option value="post_content">Contenu de l'article</option>
                  <option value="post_excerpt">Extrait de l'article</option>
                  <option value="post_date">Date de publication</option>
                  <option value="post_status">Statut de l'article</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2">
        <button 
          type="button" 
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Annuler
        </button>
        <button 
          type="button" 
          onClick={handleImport}
          className="px-4 py-2 bg-gray-700 text-sm font-medium text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Importer
        </button>
      </div>
    </div>
  );
}
