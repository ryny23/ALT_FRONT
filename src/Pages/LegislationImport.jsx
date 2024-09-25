import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Link, Download, Check, X, Edit, Trash, GripVertical } from 'lucide-react'
import Papa from 'papaparse'
import axios from 'axios'
import Select from 'react-select'

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2"

const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const LinkedTextBadge = () => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
    <Link className="w-3 h-3 mr-1" />
    Lié
  </span>
)

const LegislationNode = React.memo(({ node, position, onDrop, onEdit, onDelete, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(node.content);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(node.id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div
      className="flex items-center space-x-2 mb-2 p-2 border rounded cursor-move"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ ...node, position }));
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, node.id, position)}
    >
      <GripVertical className="text-gray-400" />
      {isEditing ? (
        <input
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="flex-grow border rounded px-2 py-1"
        />
      ) : (
        <span className="flex-grow">{node.type}: {node.content}</span>
      )}
      <span className="text-gray-500">{position}</span>
      <button onClick={handleEdit} className="p-1 text-blue-500 hover:bg-blue-100 rounded">
        {isEditing ? <X size={16} /> : <Edit size={16} />}
      </button>
      <button onClick={() => onDelete(node.id)} className="p-1 text-red-500 hover:bg-red-100 rounded">
        <Trash size={16} />
      </button>
      {node.type === 'article' && (
        <button onClick={() => onRemove(node.id)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
          <X size={16} />
        </button>
      )}
    </div>
  );
});

const StructureArticles = ({ selectedLegislation, selectedArticles, onStructureComplete }) => {
  const [legislationStructure, setLegislationStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articlePositions, setArticlePositions] = useState({});

  useEffect(() => {
    const fetchLegislationStructure = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/legislations/${selectedLegislation.value}`);
        const identifiers = res.data.acf.titre_ou_chapitre_ou_section_ou_articles;
        const endpoints = ['titres', 'chapitres', 'sections', 'articles'];
        
        const fetchData = async (id) => {
          for (let endpoint of endpoints) {
            try {
              const res = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`);
              if (res.data) {
                return { 
                  ...res.data, 
                  type: endpoint.slice(0, -1), 
                  id: res.data.id,
                  content: res.data.title?.rendered || res.data.acf?.titre || 'Sans titre'
                };
              }
            } catch (err) {
              // Continue to the next endpoint if not found
            }
          }
          return null;
        };

        const structureData = await Promise.all(identifiers.map(fetchData));
        const validStructureData = structureData.filter(item => item !== null);
        
        setLegislationStructure(updatePositions(validStructureData));
      } catch (error) {
        console.error("Erreur lors de la récupération de la structure de la législation:", error);
        setError("Erreur lors de la récupération de la structure de la législation");
      } finally {
        setLoading(false);
      }
    };
    fetchLegislationStructure();
  }, [selectedLegislation]);

  const updatePositions = (structure) => {
    return structure.map((item, index) => ({
      ...item,
      position: index + 1
    }));
  };

  const handleDrop = useCallback((e, targetId) => {
    e.preventDefault();
    const draggedArticle = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    setLegislationStructure(prevStructure => {
      const newStructure = [...prevStructure];
      const targetIndex = newStructure.findIndex(item => item.id === targetId);
      
      // Remove the article if it's already in the structure
      const existingIndex = newStructure.findIndex(item => item.id === draggedArticle.id);
      if (existingIndex !== -1) {
        newStructure.splice(existingIndex, 1);
      }
      
      // Insert the article at the new position
      newStructure.splice(targetIndex + 1, 0, draggedArticle);
      
      // Update positions
      const newArticlePositions = {};
      newStructure.forEach((item, index) => {
        if (item.type === 'article') {
          newArticlePositions[item.id] = index + 1;
        }
      });
      setArticlePositions(newArticlePositions);
      
      return newStructure;
    });
  }, []);

  const handleEdit = (id, newContent) => {
    setLegislationStructure(prevStructure => 
      prevStructure.map(item => 
        item.id === id ? { ...item, content: newContent } : item
      )
    );
  };

  const handleDelete = (id) => {
    setLegislationStructure(prevStructure => 
      prevStructure.filter(item => item.id !== id)
    );
  };

  const handleRemove = (id) => {
    setLegislationStructure(prevStructure => 
      prevStructure.filter(item => item.id !== id)
    );
  };

  const handleComplete = useCallback(() => {
    onStructureComplete(articlePositions);
  }, [articlePositions, onStructureComplete]);

  if (loading) return <div>Chargement de la structure de la législation...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="flex space-x-4">
      <div className="w-2/3 border p-4 rounded">
        <h4 className="font-medium mb-2">Structure de la législation</h4>
        {legislationStructure.map((item) => (
          <div
            key={item.id}
            className="p-2 border mb-2 rounded"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, item.id)}
          >
            {item.type}: {item.content} - Position: {item.position}
          </div>
        ))}
      </div>
      <div className="w-1/3 border p-4 rounded">
        <h4 className="font-medium mb-2">Articles à placer</h4>
        {selectedArticles.map((article) => (
          <div
            key={article.id}
            className="p-2 border mb-2 rounded cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', JSON.stringify({
                id: article.id,
                type: 'article',
                content: article.Title
              }));
            }}
          >
            {article.Title}
          </div>
        ))}
      </div>
      <button
        onClick={handleComplete}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Valider la structure
      </button>
    </div>
  );
};

export default function LegislationImport({ currentStep, onComplete }) {
  const [file, setFile] = useState(null)
  const [parsedTexts, setParsedTexts] = useState([])
  const [selectedTexts, setSelectedTexts] = useState([])
  const [error, setError] = useState(null)
  const [selectedLinkedTexts, setSelectedLinkedTexts] = useState({})
  const [availableTexts, setAvailableTexts] = useState({})
  const [bulkSelection, setBulkSelection] = useState(false)
  const [bulkLinkedTexts, setBulkLinkedTexts] = useState({})
  const [linkedTextsFromFile, setLinkedTextsFromFile] = useState({})
  const [selectedLegislation, setSelectedLegislation] = useState(null)
  const [articlePositions, setArticlePositions] = useState({})

  useEffect(() => {
    const fetchTexts = async () => {
      const texts = {}
      const textTypes = ["Législation", "Décision", "Commentaire"]
      for (const type of textTypes) {
        try {
          const response = await axios.get(`${API_BASE_URL}/${removeAccents(type.toLowerCase())}s`)
          texts[type] = response.data.map(item => ({
            value: item.id.toString(),
            label: item.title?.rendered || item.acf?.titre || 'Sans titre',
            type
          }))
        } catch (err) {
          console.error(`Erreur lors de la récupération des ${type}s:`, err)
          texts[type] = []
        }
      }
      setAvailableTexts(texts)
    }
    fetchTexts()
  }, [])

  const validateCSV = (results) => {
    const requiredColumns = ['Title', 'Content', 'Législations_liés', 'Décisions_liés', 'Commentaires_liés']
    const headers = results.meta.fields

    const missingColumns = requiredColumns.filter(col => !headers.includes(col))
    if (missingColumns.length > 0) {
      setError(`Colonnes manquantes dans le CSV : ${missingColumns.join(', ')}`)
      return false
    }

    if (results.data.length === 0) {
      setError("Le fichier CSV est vide")
      return false
    }

    return true
  }

  const handleFileChange = useCallback((event) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!validateCSV(results)) {
            return
          }

          const cleanedData = results.data.map(row => {
            const cleanedRow = {}
            Object.keys(row).forEach(key => {
              cleanedRow[key.trim()] = row[key]
            })
            return cleanedRow
          })
  
          if (results.errors.length > 0) {
            setError(`Erreur de parsing CSV: ${results.errors[0].message}`)
          } else {
            setParsedTexts(cleanedData)
            setError(null)
  
            const linkedTexts = {}
            ["Législation", "Décision", "Commentaire"].forEach(type => {
              const columnName = `${type}s_liés`
              cleanedData.forEach((row, index) => {
                if (row[columnName]) {
                  const texts = row[columnName].split(',').map(text => {
                    const [label, id] = text.trim().split('|')
                    return { value: id, label, type }
                  })
                  linkedTexts[index] = [...(linkedTexts[index] || []), ...texts]
                }
              })
            })
            setLinkedTextsFromFile(linkedTexts)
          }
        }
      })
    }
  }, [])

  const handleTextSelection = useCallback((index) => {
    setSelectedTexts(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }, [])

  const handleLinkedText = useCallback((selectedIndex, newLinkedTexts, type) => {
    setSelectedLinkedTexts(prev => {
      const updatedLinkedTexts = { ...prev }
      if (!updatedLinkedTexts[selectedIndex]) {
        updatedLinkedTexts[selectedIndex] = []
      }
      updatedLinkedTexts[selectedIndex] = updatedLinkedTexts[selectedIndex]
        .filter(text => text.type !== type)
        .concat(newLinkedTexts)
      return updatedLinkedTexts
    })
  }, [])

  const handleBulkSelection = useCallback((select) => {
    setBulkSelection(select)
    if (!select) {
      setSelectedLinkedTexts({})
    }
  }, [])

  const handleBulkLinkedText = useCallback((selectedOptions) => {
    setBulkLinkedTexts(selectedOptions)
    if (bulkSelection) {
      const newSelectedLinkedTexts = {}
      selectedTexts.forEach(selectedIndex => {
        newSelectedLinkedTexts[selectedIndex] = selectedOptions
      })
      setSelectedLinkedTexts(newSelectedLinkedTexts)
    }
  }, [bulkSelection, selectedTexts])

  const handleStructureComplete = useCallback((positions) => {
    setArticlePositions(positions)
  }, [])

  const exportModifiedCSV = useCallback(() => {
    const exportData = selectedTexts.map(index => {
      const article = parsedTexts[index]
      const linkedTexts = selectedLinkedTexts[index] || []
      const exportRow = { ...article, position: articlePositions[article.id] || '' }
      
      ["Législation", "Décision", "Commentaire"].forEach(type => {
        const textsOfType = linkedTexts.filter(t => t.type === type)
        exportRow[`${type}s_liés`] = textsOfType.map(t => `${t.label}${t.value ? `|${t.value}` : ''}`).join(', ')
      })

      return exportRow
    })

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'articles_modifiés.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [selectedTexts, parsedTexts, selectedLinkedTexts, articlePositions])

  const handleComplete = useCallback(async () => {
    try {
      const importData = selectedTexts.map(index => {
        const article = parsedTexts[index]
        return {
          title: article.Title,
          content: article.Content,
          legislation: selectedLegislation?.value,
          position: articlePositions[article.id] || null,
          linkedTexts: selectedLinkedTexts[index] || []
        }
      })

      await axios.post(`${API_BASE_URL}/import/articles`, importData)
      onComplete(importData)
    } catch (error) {
      setError("Une erreur est survenue lors de l'importation des articles")
    }
  }, [selectedTexts, parsedTexts, selectedLegislation, articlePositions, selectedLinkedTexts, onComplete])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-500">Charger le fichier CSV</h2>
            <div className="bg-white p-4 rounded-md shadow">
              <p className="text-sm text-gray-600 mb-2">
                Le fichier CSV doit contenir les colonnes suivantes : Title, Content, Date_entree (obligatoires),
                ID_decision, ID_commentaire, ID_legislation, Position_legislation (optionnelles)
              </p>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Fichier CSV</label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                {error}
              </div>
            )}
          </div>
        );
        case 1:
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-500">Prévisualisation des articles</h2>
              <div className="bg-white p-4 rounded-md shadow max-h-96 overflow-y-auto">
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => setSelectedArticles(parsedArticles.map((_, index) => index))}
                    className="text-green-500"
                  >
                    Tout sélectionner
                  </button>
                  <button
                    onClick={() => setSelectedArticles([])}
                    className="text-green-500"
                  >
                    Tout désélectionner
                  </button>
                </div>
                {parsedArticles.map((article, index) => (
                  <div key={index} className="mb-4 p-3 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`article-${index}`}
                          checked={selectedArticles.includes(index)}
                          onChange={() => handleArticleSelection(index)}
                          className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`article-${index}`} className="text-sm font-medium text-gray-700">
                          {article.Title} - <span className="text-gray-500">{article.Date_entree}</span>
                        </label>
                      </div>
                      {(article.ID_decision || article.ID_commentaire || article.ID_legislation) && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Déjà lié</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{article.Content.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          );
      case 2:
        return (
          <motion.div className="flex flex-col gap-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Chargez votre fichier CSV</label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {error && (
              <div className="text-red-500 flex items-center gap-2 mt-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            {file && !error && (
              <p className="mt-2 text-sm text-green-600">
                Fichier chargé avec succès : {file.name}
              </p>
            )}
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Format du fichier CSV pour les articles :</h4>
              <ul className="list-disc list-inside text-sm text-blue-700">
                <li>Title : Titre de l'article</li>
                <li>Content : Contenu de l'article</li>
                <li>Législations_liés : Liste des législations liées (format : "Nom|ID, Nom|ID")</li>
                <li>Décisions_liés : Liste des décisions liées (format : "Nom|ID, Nom|ID")</li>
                <li>Commentaires_liés : Liste des commentaires liés (format : "Nom|ID, Nom|ID")</li>
              </ul>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div>
            <h3 className="text-lg font-semibold mb-4">Prévisualisation et sélection des articles</h3>
            <p>Nom du fichier : {file?.name}</p>
            <div className="flex justify-between mb-2">
              <button onClick={() => setSelectedTexts(parsedTexts.map((_, index) => index))} className="text-green-500">
                Tout sélectionner
              </button>
              <button onClick={() => setSelectedTexts([])} className="text-green-500">
                Tout désélectionner
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parsedTexts.map((text, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={`text-${index}`} className="text-sm font-medium text-gray-700 flex items-center">
                      <input
                        type="checkbox"
                        id={`text-${index}`}
                        checked={selectedTexts.includes(index)}
                        onChange={() => handleTextSelection(index)}
                        className="mr-2 rounded text-green-600 focus:ring-green-500"
                      />
                      {text.Title}
                    </label>
                    {linkedTextsFromFile[index] && linkedTextsFromFile[index].length > 0 && (
                      <LinkedTextBadge />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-3">{text.Content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Lier les articles</h3>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Lier à une législation :</label>
                <Select
                  options={availableTexts["Législation"] || []}
                  value={selectedLegislation}
                  onChange={(selected) => setSelectedLegislation(selected)}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkSelection}
                    onChange={(e) => handleBulkSelection(e.target.checked)}
                    className="mr-2"
                  />
                  Liaison en bloc
                </label>
              </div>
              {bulkSelection ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Lier les textes en bloc :</label>
                  <Select
                    options={availableTexts["Commentaire"].concat(availableTexts["Décision"])}
                    value={bulkLinkedTexts}
                    onChange={handleBulkLinkedText}
                    isMulti
                    className="w-full"
                  />
                </div>
              ) : (
                selectedTexts.map((selectedIndex) => (
                  <div key={selectedIndex} className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">{parsedTexts[selectedIndex].Title}</h4>
                    {["Décision", "Commentaire"].map(type => (
                      <div key={type} className="mb-4">
                        <label className="block text-sm font-medium mb-1">{`Lier ${type}s:`}</label>
                        <Select
                          options={availableTexts[type] || []}
                          value={selectedLinkedTexts[selectedIndex]?.filter(text => text.type === type) || []}
                          onChange={(selectedOptions) => handleLinkedText(selectedIndex, selectedOptions, type)}
                          isMulti
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )
      case 5:
        return (
          <motion.div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Structurer les articles dans la législation</h3>
            {selectedLegislation ? (
              <StructureArticles
                selectedLegislation={selectedLegislation}
                selectedArticles={selectedTexts.map(index => parsedTexts[index])}
                onStructureComplete={handleStructureComplete}
              />
            ) : (
              <div>Veuillez d'abord sélectionner une législation.</div>
            )}
          </motion.div>
        )
      case 6:
        return (
          <motion.div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Confirmation</h3>
            <p>Fichier : {file?.name}</p>
            <h4 className="font-semibold">Structure du texte avec ses liaisons :</h4>
            <div className="h-[300px] rounded-md border p-4 overflow-auto">
              {selectedTexts.map(index => {
                const article = parsedTexts[index]
                return (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{article.Title}</p>
                    <p><strong>Législation:</strong> {selectedLegislation?.label}</p>
                    <p><strong>Position:</strong> {articlePositions[article.id] || 'Non définie'}</p>
                    {["Décision", "Commentaire"].map(type => {
                      const textsOfType = selectedLinkedTexts[index]?.filter(text => text.type === type) || []
                      if (textsOfType.length > 0) {
                        return (
                          <p key={type}>
                            <strong>{type}s:</strong> {textsOfType.map(text => text.label).join(', ')}
                          </p>
                        )
                      }
                      return null
                    })}
                  </div>
                )
              })}
            </div>
            <button
              onClick={exportModifiedCSV}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              <Download className="h-4 w-4 inline mr-2" />
              Exporter le CSV modifié
            </button>
            <button
              onClick={handleComplete}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Terminer l'importation
            </button>
          </motion.div>
        )
      default:
        return null
    }
  }

  return renderStepContent()
}