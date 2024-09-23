import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Download, Edit, Trash, X, GripVertical, Link } from 'lucide-react'
import Papa from 'papaparse'
import axios from 'axios'
import Select from 'react-select'

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2"

const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const textTypes = ["Article", "Législation", "Décision", "Commentaire"]

const steps = [
  "Import",
  "Sélectionner le type",
  "Charger le fichier",
  "Prévisualisation",
  "Lier les textes",
  "Structuration",
  "Confirmation"
]

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

const LinkedTextBadge = () => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
    <Link className="w-3 h-3 mr-1" />
    Lié
  </span>
)

export default function LegalTextManager() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedType, setSelectedType] = useState("")
  const [file, setFile] = useState(null)
  const [parsedTexts, setParsedTexts] = useState([])
  const [selectedTexts, setSelectedTexts] = useState([])
  const [isImportComplete, setIsImportComplete] = useState(false)
  const [error, setError] = useState(null)
  const [selectedLinkedTexts, setSelectedLinkedTexts] = useState({})
  const [availableTexts, setAvailableTexts] = useState({})
  const [legislationStructures, setLegislationStructures] = useState([])
  const [selectedLegislationIndex, setSelectedLegislationIndex] = useState(null)
  const [canEditStructure, setCanEditStructure] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [bulkSelection, setBulkSelection] = useState(false)
  const [bulkLinkedTexts, setBulkLinkedTexts] = useState({})
  const [linkedTextsFromFile, setLinkedTextsFromFile] = useState({})
  const [legislationLinkedTexts, setLegislationLinkedTexts] = useState([])
  const [selectedLegislation, setSelectedLegislation] = useState(null)
  const [legislationStructure, setLegislationStructure] = useState([])
  const [articlePositions, setArticlePositions] = useState({})
  const [draggedArticle, setDraggedArticle] = useState(null)

  const renderLegislationStructureRef = useRef()

  renderLegislationStructureRef.current = (structure) => {
    return structure.map((node, index) => (
      <LegislationNode
        key={node.id}
        node={node}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={canEditStructure}
        onDragEnd={() => {/* Logique de mise à jour si nécessaire */}}
      >
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, node.id)}
          className="ml-4 border-l-2 border-gray-300 pl-2"
        >
          {node.children && renderLegislationStructureRef.current(node.children)}
        </div>
      </LegislationNode>
    ))
  }

  useEffect(() => {
    const fetchTexts = async () => {
      const texts = {}
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

  const handleFileChange = useCallback((event) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const cleanedData = results.data.map(row => {
            const cleanedRow = {}
            Object.keys(row).forEach(key => {
              cleanedRow[key.trim()] = row[key]
            })
            return cleanedRow
          })
  
          const headers = Object.keys(cleanedData[0] || {}).map(header => header.trim())
          let isValid = true
          let errorMessage = ""
  
          if (results.errors.length > 0) {
            errorMessage = `Erreur de parsing CSV: ${results.errors[0].message}`
            isValid = false
          }
  
          if (cleanedData.length === 0) {
            errorMessage = "Le fichier CSV est vide"
            isValid = false
          }
  
          if (isValid) {
            if (selectedType === "Législation") {
              const structures = buildLegislationStructures(cleanedData)
              setLegislationStructures(structures)
              setParsedTexts(structures)

              // Extraire les textes liés de la législation
              const linkedTexts = cleanedData.filter(row => row['Texte lié'])
                .map(row => ({ id: row['Texte lié'], type: 'Texte lié' }))
              setLegislationLinkedTexts(linkedTexts)
            } else {
              setParsedTexts(cleanedData)

              // Extraire les textes liés pour les autres types
              const linkedTexts = {}
              textTypes.forEach(type => {
                if (type !== selectedType) {
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
                }
              })
              setLinkedTextsFromFile(linkedTexts)
            }
            setError(null)
          } else {
            setError(errorMessage)
            setParsedTexts([])
            event.target.value = null
          }
        }
      })
    }
  },
  [selectedType])

  const buildLegislationStructures = useCallback((data) => {
    const structures = []
    let currentStructure = null
    let currentLegislation = null

    data.forEach((row) => {
      if (row.Titre_legislation && row.Titre_legislation !== currentLegislation) {
        if (currentStructure) {
          structures.push(currentStructure)
        }
        currentLegislation = row.Titre_legislation
        currentStructure = {
          Titre_legislation: row.Titre_legislation,
          "Date d'entrée en vigueur": row["Date d'entrée en vigueur"],
          "Date dernière modification": row["Date dernière modification"],
          "Code visé": row["Code visé"],
          structure: []
        }
      }

      const node = {
        id: Math.random().toString(36).substr(2, 9),
        type: row.Titre ? 'Titre' : row.Chapitre ? 'Chapitre' : row.Section ? 'Section' : 'Texte lié',
        content: row.Titre || row.Chapitre || row.Section || row['Texte lié'],
      }

      currentStructure.structure.push(node)
    })

    if (currentStructure) {
      structures.push(currentStructure)
    }

    return structures
  }, [])

  const handleTextSelection = useCallback((index) => {
    setSelectedTexts(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }, [])

  const handleLinkedText = useCallback((selectedIndex, newLinkedTexts, type) => {
    if (selectedType === "Législation") {
      setLegislationLinkedTexts(prev => {
        const updatedTexts = prev.filter(text => text.type !== type)
        return [...updatedTexts, ...newLinkedTexts.map(text => ({ ...text, type }))]
      })
    } else {
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
    }
  }, [selectedType])

  useEffect(() => {
    if (Object.keys(linkedTextsFromFile).length > 0) {
      setSelectedLinkedTexts(linkedTextsFromFile)
    }
  }, [linkedTextsFromFile])

  const handleDrop = useCallback((e, targetId) => {
    e.preventDefault()
    if (draggedArticle) {
      setLegislationStructures(prevStructures => {
        const newStructures = [...prevStructures]
        const structure = newStructures[selectedLegislationIndex].structure
        const targetIndex = structure.findIndex(node => node.id === targetId)
        
        // Remove the article if it's already in the structure
        const existingIndex = structure.findIndex(node => node.id === draggedArticle.id)
        if (existingIndex !== -1) {
          structure.splice(existingIndex, 1)
        }
        
        // Insert the article at the new position
        structure.splice(targetIndex + 1, 0, draggedArticle)
        
        // Update positions
        structure.forEach((node, index) => {
          node.position = index + 1
        })
        
        return newStructures
      })
      setDraggedArticle(null)
    }
  }, [draggedArticle, selectedLegislationIndex])

  const handleComplete = () => {
    const updatedArticlePositions = {}
    legislationStructures[selectedLegislationIndex].structure.forEach((node, index) => {
      if (node.type === 'article') {
        updatedArticlePositions[node.id] = index + 1
      }
    })
    setArticlePositions(updatedArticlePositions)
    onStructureComplete(updatedArticlePositions)
  }

  const handleEdit = useCallback((node) => {
    const newContent = prompt("Entrez le nouveau contenu:", node.content)
    if (newContent !== null) {
      setLegislationStructures(prevStructures => {
        return prevStructures.map((structure, index) => {
          if (index === selectedLegislationIndex) {
            return {
              ...structure,
              structure: structure.structure.map(item => 
                item.id === node.id ? { ...item, content: newContent } : item
              )
            }
          }
          return structure
        })
      })
    }
  }, [selectedLegislationIndex])
  
  const handleDelete = useCallback((node) => {
    setLegislationStructures(prevStructures => {
      return prevStructures.map((structure, index) => {
        if (index === selectedLegislationIndex) {
          return {
            ...structure,
            structure: structure.structure.filter(item => item.id !== node.id)
          }
        }
        return structure
      })
    })
  }, [selectedLegislationIndex])

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

  useEffect(() => {
    if (bulkSelection) {
      const newSelectedLinkedTexts = {}
      selectedTexts.forEach(selectedIndex => {
        newSelectedLinkedTexts[selectedIndex] = Object.entries(bulkLinkedTexts)
          .filter(([type]) => type !== selectedType)
          .flatMap(([type, texts]) => texts || [])
      })
      setSelectedLinkedTexts(newSelectedLinkedTexts)
    }
  }, [bulkSelection, bulkLinkedTexts, selectedTexts, selectedType])

  const handleStructureComplete = useCallback((positions) => {
    setArticlePositions(positions);
    setCurrentStep(currentStep + 1);
  }, [currentStep]);
  
  

  const exportModifiedCSV = useCallback(() => {
    let exportData;
    if (selectedType === "Législation") {
      const flattenStructure = (structure, parentPosition = '') => {
        return structure.flatMap((node, index) => {
          const position = parentPosition ? `${parentPosition}.${index + 1}` : `${index + 1}`;
          const nodeData = {
            Titre_legislation: legislationStructures[selectedLegislationIndex].Titre_legislation,
            "Date d'entrée en vigueur": legislationStructures[selectedLegislationIndex]["Date d'entrée en vigueur"],
            "Date dernière modification": legislationStructures[selectedLegislationIndex]["Date dernière modification"],
            "Code visé": legislationStructures[selectedLegislationIndex]["Code visé"],
            [node.type]: node.content,
            Position: position
          };
          return node.children ? [nodeData, ...flattenStructure(node.children, position)] : [nodeData];
        });
      };
      exportData = flattenStructure(legislationStructures[selectedLegislationIndex].structure);
    } else if (selectedType === "Article") {
      exportData = selectedTexts.map(index => {
        const text = parsedTexts[index];
        const linkedTexts = selectedLinkedTexts[index] || [];
        const exportRow = { ...text, position: text.position || '' };
        
        textTypes.forEach(type => {
          if (type !== selectedType) {
            const textsOfType = linkedTexts.filter(t => t.type === type);
            exportRow[`${type}s_liés`] = textsOfType.map(t => `${t.label}${t.value ? `|${t.value}` : ''}`).join(', ');
          }
        });
  
        return exportRow;
      });
    }
  
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'articles_modifiés.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [selectedTexts, parsedTexts, selectedLinkedTexts, articlePositions, selectedType]);
  
  const renderStepContent = useCallback(() => {
    const animationProps = {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
      className: "flex flex-col gap-4"
    }

    switch (currentStep) {
      case 0:
        return (
          <motion.div {...animationProps}>
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-16 h-16 text-green-500" />
              <h2 className="text-2xl font-bold">Importer un texte juridique</h2>
              <p className="text-center text-gray-600">
                Cliquez sur "Suivant" pour commencer le processus d'importation.
              </p>
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div {...animationProps}>
            <label htmlFor="text-type" className="block text-sm font-medium text-gray-700">Sélectionnez le type de texte</label>
            <select
              id="text-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Choisissez un type</option>
              {textTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </motion.div>
        )
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
              {selectedType === "Législation" ? (
                <ul className="list-disc list-inside mt-2">
                  <li>Titre_legislation</li>
                  <li>Date d'entrée en vigueur</li>
                  <li>Date dernière modification</li>
                  <li>Code visé</li>
                  <li>Titre</li>
                  <li>Chapitre</li>
                  <li>Section</li>
                  <li>Texte lié</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside mt-2">
                  <li>Title</li>
                  <li>Content</li>
                </ul>
              )}
            </div>
          </motion.div>
        )
        case 3: // Prévisualisation
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Prévisualisation et sélection des textes</h3>
            <p>Nom du fichier : {file?.name}</p>
            <p>Type de texte : {selectedType}</p>
            {selectedType === "Législation" ? (
              <div>
                <h4 className="font-semibold mb-2">Sélectionnez une législation :</h4>
                {parsedTexts.map((legislation, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="radio"
                      id={`legislation-${index}`}
                      name="legislation"
                      value={index}
                      checked={selectedLegislationIndex === index}
                      onChange={() => setSelectedLegislationIndex(index)}
                    />
                    <label htmlFor={`legislation-${index}`} className="ml-2">
                      {legislation.Titre_legislation}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <>
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
              </>
            )}
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
      }, [currentStep, selectedType, file, parsedTexts, selectedTexts, selectedLegislation, articlePositions, selectedLinkedTexts, exportModifiedCSV]);

      const renderLegislationStructure = useCallback((structure) => {
        return structure.map((node, index) => (
          <LegislationNode
            key={node.id}
            node={node}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEditStructure}
            onDragEnd={() => {/* Logique de mise à jour si nécessaire */}}
          >
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, node.id)}
              className="ml-4 border-l-2 border-gray-300 pl-2"
            >
              {node.children && renderLegislationStructure(node.children)}
            </div>
          </LegislationNode>
        ))
      }, [handleEdit, handleDelete, canEditStructure, handleDrop])

    const renderStepIndicators = useCallback(() => {
    const currentIndex = steps.findIndex(step => step === steps[currentStep])
    const prevStep = steps[currentIndex - 1]
    const nextStep = steps[currentIndex + 1]

    return (
      <div className="flex justify-center items-center space-x-4 mb-8">
        {prevStep && (
          <motion.div
            className="text-sm text-gray-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {prevStep}
          </motion.div>
        )}
        <motion.div
          className="text-lg font-bold bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          {currentStep + 1}
        </motion.div>
        {nextStep && (
          <motion.div
            className="text-sm text-gray-500"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {nextStep}
          </motion.div>
        )}
      </div>
    )
  }, [currentStep])

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {!isImportComplete && renderStepIndicators()}

      <AnimatePresence mode="wait">
        {!isImportComplete ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg border p-4 md:p-6 shadow-sm"
          >
            {renderStepContent()}
          </motion.div>
        ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="flex flex-col items-center gap-4 p-6 bg-green-100 rounded-lg"
        >
          <Check className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-bold text-green-700">Importation en cours...</h2>
          <p className="text-center text-green-600">
            Votre importation est en cours de traitement. Cela pourrait prendre plusieurs heures. Vous pouvez continuer en cliquant sur le bouton ci-dessous.
          </p>
          <button
            onClick={() => {
              setCurrentStep(0)
              setSelectedType("")
              setFile(null)
              setParsedTexts([])
              setSelectedTexts([])
              setIsImportComplete(false)
              setError(null)
              setSelectedLinkedTexts({})
              setLegislationStructures([])
              setSelectedLegislationIndex(null)
              setCanEditStructure(false)
              setBulkSelection(false)
              setBulkLinkedTexts({})
            }}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Nouvelle importation
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {!isImportComplete && (
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4 inline" /> Précédent
          </button>
          <button
            onClick={() => {
              if (currentStep === steps.length - 1) {
                setIsImportComplete(true)
              } else {
                // Assurez-vous que l'étape de structuration est to
                const nextStep = currentStep + 1
                setCurrentStep(Math.min(steps.length - 1, nextStep))
              }
            }}
            disabled={
              error !== null || 
              (currentStep === 1 && !selectedType) ||
              (currentStep === 3 && selectedType === "Législation" && selectedLegislationIndex === null) ||
              (currentStep === 3 && selectedType !== "Législation" && selectedTexts.length === 0)
            }
            className="px-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <FileText className="mr-2 h-4 w-4 inline" /> Confirmer l'importation
              </>
            ) : (
              <>
                Suivant <ArrowRight className="ml-2 h-4 w-4 inline" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}