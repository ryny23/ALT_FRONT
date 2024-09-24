<<<<<<< HEAD
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
=======
import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Link, Download } from 'lucide-react'
import Papa from 'papaparse'
import axios from 'axios'
import Select from 'react-select'

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2"

const LinkedTextBadge = () => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
    <Link className="w-3 h-3 mr-1" />
    Lié
  </span>
)

export default function ArticleImport({ currentStep, onComplete }) {
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
  const [selectedType, setSelectedType] = useState("article")

  useEffect(() => {
    const fetchTexts = async () => {
      const texts = {}
      for (const type of ["legislation", "decision", "commentaire"]) {
        try {
          const response = await axios.get(`${API_BASE_URL}/${type}s`)
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

  const handleFileChange = useCallback((event) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed CSV results:", results) // Debug log
          if (results.errors.length > 0) {
            setError(`Erreur de parsing CSV: ${results.errors[0].message}`)
          } else if (results.data.length === 0) {
            setError("Le fichier CSV est vide")
          } else {
            setParsedTexts(results.data)
            setError(null)

            const linkedTexts = {}
            results.data.forEach((row, index) => {
              linkedTexts[index] = []
              ;["legislation", "decision", "commentaire"].forEach(type => {
                const columnName = `${type}s_lies`
                if (row[columnName]) {
                  const texts = row[columnName].split(',').map(text => {
                    const [label, id] = text.trim().split('|')
                    return { value: id, label, type }
                  })
                  linkedTexts[index].push(...texts)
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
      const text = parsedTexts[index]
      const linkedTexts = selectedLinkedTexts[index] || []
      const exportRow = { ...text, position: articlePositions[text.id] || '' }
      
      ["legislation", "decision", "commentaire"].forEach(type => {
        const textsOfType = linkedTexts.filter(t => t.type === type)
        exportRow[`${type}s_lies`] = textsOfType.map(t => `${t.label}${t.value ? `|${t.value}` : ''}`).join(', ')
      })

      return exportRow
    })

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'articles_modifies.csv')
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

  const renderStepContent = useCallback(() => {
    const animationProps = {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
      className: "flex flex-col gap-4"
    }

    switch (currentStep) {
      case 2:
        return (
          <motion.div {...animationProps}>
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
            <div className="mt-4 text-sm text-gray-600">
              <p>Le fichier CSV doit contenir les colonnes suivantes :</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Title</li>
                  <li>Content</li>
                </ul>
            </div>
          </motion.div>
        )
        case 3: // Prévisualisation
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Prévisualisation et sélection des textes</h3>
            <p>Nom du fichier : {file?.name}</p>
                <div className="flex justify-between mb-2">
                  <button onClick={() => setSelectedTexts(parsedTexts.map((_, index) => index))} className="text-green-500">
                    Tout sélectionner
                  </button>
                  <button onClick={() => setSelectedTexts([])} className="text-green-500">
                    Tout désélectionner
                  </button>
                </div>
                <div className="h-[400px] w-full rounded-md border p-4 overflow-auto">
                  {parsedTexts.map((text, index) => (
                    <div key={index} className="mb-4 border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`text-${index}`}
                          checked={selectedTexts.includes(index)}
                          onChange={() => handleTextSelection(index)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor={`text-${index}`} className="text-sm font-medium text-gray-700">
                          {text.Title}
                        </label>
                        {linkedTextsFromFile[index] && linkedTextsFromFile[index].length > 0 && (
                          <LinkedTextBadge />
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{text.Content.substring(0, 200)}...</p>
                    </div>
                  ))}
                </div>
          </motion.div>
        )

        case 4: // Lier les textes
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Lier les textes</h3>
            {selectedType === "Article" ? (
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
                      {textTypes.filter(type => type !== "Article" && type !== "Législation").map(type => (
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
            ) : (
              <div className="flex space-x-4">
                <div className="w-2/3 border p-4 rounded">
                  <h4 className="font-medium mb-2">Structure de la législation</h4>
                  <Reorder.Group
                    axis="y"
                    onReorder={(newOrder) => {
                      setLegislationStructures(prevStructures => {
                        const newStructures = [...prevStructures]
                        newStructures[selectedLegislationIndex] = {
                          ...newStructures[selectedLegislationIndex],
                          structure: newOrder
                        }
                        return newStructures
                      })
                    }}
                    values={legislationStructures[selectedLegislationIndex]?.structure || []}
                  >
                    {legislationStructures[selectedLegislationIndex]?.structure.map((node) => (
                      <LegislationNode
                        key={node.id}
                        node={node}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={canEditStructure}
                        onDragEnd={() => {/* Logique de mise à jour si nécessaire */}}
                      />
                    ))}
                  </Reorder.Group>
                </div>
                <div className="w-1/3 border p-4 rounded">
                  <h4 className="font-medium mb-2">Textes liés</h4>
                  {textTypes.filter(type => type !== "Législation").map(type => (
                    <div key={type} className="mb-4">
                      <label className="block text-sm font-medium mb-1">{`${type}s:`}</label>
                      <Select
                        options={availableTexts[type] || []}
                        value={legislationLinkedTexts.filter(text => text.type === type)}
                        onChange={(selectedOptions) => handleLinkedText(selectedLegislationIndex, selectedOptions, type)}
                        isMulti
                        className="w-full"
                      />
                    </div>
                  ))}
                  <div className="mt-4">
                    {legislationLinkedTexts.map((text) => (
                      <div
                        key={text.value}
                        className="mb-2 p-2 border rounded cursor-move"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify(text))
                        }}
                      >
                        {text.type}: {text.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )

        case 5: // Structurer les articles dans la législation
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Structurer les articles dans la législation</h3>
            {selectedType === "Article" && selectedLegislation ? (
              <StructureArticles
                selectedLegislation={selectedLegislation}
                selectedArticles={selectedTexts.map(index => parsedTexts[index])}
                onStructureComplete={handleStructureComplete}
              />
            ) : (
              <div>Cette étape n'est applicable que pour l'import d'articles.</div>
            )}
          </motion.div>
        )

        case 6: // Confirmation
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Confirmation</h3>
            <p>Type de texte : {selectedType}</p>
            <p>Fichier : {file?.name}</p>
            <h4 className="font-semibold">Structure du texte avec ses liaisons :</h4>
            <div className="h-[300px] rounded-md border p-4 overflow-auto">
              {selectedType === "Législation" ? (
                <div>
                  <p className="font-semibold">{legislationStructures[selectedLegislationIndex]?.Titre_legislation}</p>
                  {legislationStructures[selectedLegislationIndex]?.structure.map((node, index) => (
                    <div key={index} className="ml-4">
                      <p>{node.type}: {node.content}</p>
                    </div>
                  ))}
                </div>
              ) : selectedType === "Article" ? (
                selectedTexts.map(index => {
                  const article = parsedTexts[index];
                  return (
                    <div key={index} className="mb-4">
                  <p className="font-semibold">{article.Title}</p>
                  <p><strong>Législation:</strong> {selectedLegislation?.label}</p>
                  <p><strong>Position:</strong> {articlePositions[article.id] || 'Non définie'}</p>
                  {textTypes.filter(type => type !== "Article" && type !== "Législation").map(type => {
                    const textsOfType = selectedLinkedTexts[index]?.filter(text => text.type === type) || [];
                    if (textsOfType.length > 0) {
                      return (
                        <p key={type}>
                          <strong>{type}s:</strong> {textsOfType.map(text => text.label).join(', ')}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
                  );
                })
              ) : (
                selectedTexts.map(index => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{parsedTexts[index].Title}</p>
                    {textTypes.filter(type => type !== selectedType).map(type => {
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
                    {parsedTexts[index].position !== undefined && (
                      <p><strong>Position:</strong> {parsedTexts[index].position}</p>
                    )}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={exportModifiedCSV}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              <Download className="h-4 w-4 inline mr-2" />
              Exporter le CSV modifié
            </button>
          </motion.div>
        )
          default:
            return null
        }
      }, [currentStep, file, parsedTexts, selectedTexts, selectedLegislation, articlePositions, selectedLinkedTexts, exportModifiedCSV]);


  return renderStepContent()
}
>>>>>>> main
