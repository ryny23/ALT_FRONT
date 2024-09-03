import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import Papa from 'papaparse'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const steps = [
  "Import",
  "Sélectionner le type",
  "Charger le fichier",
  "Prévisualisation",
  "Structuration",
  "Lier les textes",
  "Confirmation"
]

const textTypes = ["Article", "Législation", "Décision", "Commentaire"]

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2"

// Fonction utilitaire pour retirer les accents
const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

// Composant pour gérer les éléments de structure avec drag-and-drop
const StructureItem = ({ item, path, moveItem, addChild, removeItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'STRUCTURE_ITEM',
    item: { path },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'STRUCTURE_ITEM',
    hover(draggedItem) {
      if (draggedItem.path !== path) {
        moveItem(draggedItem.path, path)
        draggedItem.path = path
      }
    },
  })

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }} className={`mb-2 p-2 border rounded-md ${item.type === 'titre' ? 'bg-blue-100' : item.type === 'chapitre' ? 'bg-green-100' : 'bg-yellow-100'}`}>
      <div className="flex items-center justify-between">
        <span>{item.type}: {item.content}</span>
        <div>
          {['titre', 'chapitre', 'section'].map((type, idx) => (
            <button key={idx} onClick={() => addChild(path, type)} className={`mr-2 text-${type === 'titre' ? 'blue' : type === 'chapitre' ? 'green' : 'yellow'}-500`}>
              <Plus size={16} />{type.charAt(0).toUpperCase()}
            </button>
          ))}
          <button onClick={() => removeItem(path)} className="text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {item.children && item.children.length > 0 && (
        <div className="ml-4 mt-2">
          {item.children.map((child, childIndex) => (
            <StructureItem
              key={childIndex}
              item={child}
              path={`${path}-${childIndex}`}
              moveItem={moveItem}
              addChild={addChild}
              removeItem={removeItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ImportFiles() {
  // Gestion des états
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedType, setSelectedType] = useState("")
  const [file, setFile] = useState(null)
  const [parsedTexts, setParsedTexts] = useState([])
  const [selectedTexts, setSelectedTexts] = useState([])
  const [structure, setStructure] = useState([])
  const [availableTexts, setAvailableTexts] = useState({})
  const [isImportComplete, setIsImportComplete] = useState(false)
  const [error, setError] = useState(null)
  const [selectedLinkedTexts, setSelectedLinkedTexts] = useState({})
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Récupération des textes disponibles depuis l'API
  useEffect(() => {
    const fetchTexts = async () => {
      const texts = {}
      for (const type of textTypes) {
        try {
          const response = await fetch(`${API_BASE_URL}/${removeAccents(type.toLowerCase())}s`)
          const data = await response.json()
          texts[type] = data.map(item => ({
            id: item.id,
            title: item.title?.rendered || item.acf?.titre || 'Sans titre'
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

  // Initialisation des textes liés lorsque les textes sélectionnés ou le type sélectionné changent
  useEffect(() => {
    const initialLinkedTexts = {}
    selectedTexts.forEach(index => {
      initialLinkedTexts[index] = textTypes.reduce((acc, type) => {
        if (type !== selectedType) acc[type] = []
        return acc
      }, {})
    })
    setSelectedLinkedTexts(initialLinkedTexts)
  }, [selectedTexts, selectedType])

  // Validation et traitement du CSV
  const handleFileChange = useCallback((event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
        setFile(uploadedFile);
        Papa.parse(uploadedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const cleanedData = results.data.map(row => {
                    const cleanedRow = {};
                    Object.keys(row).forEach(key => {
                        cleanedRow[key.trim()] = row[key];
                    });
                    return cleanedRow;
                });

                const headers = Object.keys(cleanedData[0] || {}).map(header => header.trim());
                let isValid = true;

                const requiredHeaders = [
                    "Titre de la législation",
                    "Date d'entrée en vigueur",
                    "Date dernière modification",
                    "Code visé",
                    "Titre",
                    "Chapitre",
                    "Section"
                ];
                const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
                if (missingHeaders.length > 0) {
                    setError(`Le fichier CSV pour la législation ne contient pas les colonnes suivantes : ${missingHeaders.join(", ")}`);
                    isValid = false;
                }

                if (isValid) {
                    const aggregatedData = cleanedData.reduce((acc, item) => {
                        const key = `${item["Titre de la législation"]}-${item["Date d'entrée en vigueur"]}-${item["Date dernière modification"]}`;
                        if (!acc.map.has(key)) {
                            acc.map.set(key, { ...item, structure: [] });
                        } else {
                            const existing = acc.map.get(key);
                            existing.Titre = existing.Titre || item.Titre;
                            existing.Chapitre = existing.Chapitre || item.Chapitre;
                            existing.Section = existing.Section || item.Section;
                        }
                        return acc;
                    }, { map: new Map() });

                    const finalData = Array.from(aggregatedData.map.values());
                    setParsedTexts(finalData);
                    setStructure(finalData[0]?.structure || []);
                    setError(null);
                }
            }
        });
    }
}, []);


  // Gestion de la sélection des textes
  const handleTextSelection = useCallback((index) => {
    setSelectedTexts(prev => 
      selectedType === "Législation"
        ? [index]
        : prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
    if (selectedType === "Législation") {
      setStructure(parsedTexts[index]?.structure || [])
    }
  }, [selectedType, parsedTexts])

  // Gestion de l'ajout d'un enfant dans la structure
  const addChild = useCallback((path, type) => {
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev)) // Deep copy
      const indices = path === -1 ? [] : path.split('-').map(Number)
      let current = newStructure
      indices.forEach(idx => {
        current = current[idx].children
      })
      current.push({ type, content: `Nouveau ${type}`, children: [] })
      return newStructure
    })
  }, [])

  // Gestion de la suppression d'un élément de la structure
  const removeItem = useCallback((path) => {
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev))
      const indices = path.split('-').map(Number)
      const lastIndex = indices.pop()
      let current = newStructure
      indices.forEach(idx => {
        current = current[idx].children
      })
      current.splice(lastIndex, 1)
      return newStructure
    })
  }, [])

  const handleEditStructure = () => {
    if (!isEditingStructure) {
        setShowWarning(true);
    } else {
        setIsEditingStructure(false);
    }
};

const confirmEditStructure = () => {
    setShowWarning(false);
    setIsEditingStructure(true);
};

// Affichage du message d'avertissement
{showWarning && (
    <div className="alert alert-warning">
        <AlertTriangle size={24} />
        <p>Modifier la structure peut avoir des conséquences. Voulez-vous vraiment continuer ?</p>
        <button onClick={confirmEditStructure} className="btn btn-primary">Confirmer</button>
        <button onClick={() => setShowWarning(false)} className="btn btn-secondary">Annuler</button>
    </div>
)}

const handleSelectAll = (selectAll) => {
    if (selectAll) {
        setSelectedTexts(parsedTexts.map((_, index) => index));
    } else {
        setSelectedTexts([]);
    }
};

// Boutons pour sélectionner/décocher tout
{/* <button onClick={() => handleSelectAll(true)}>Cocher tout</button>
<button onClick={() => handleSelectAll(false)}>Décocher tout</button> */}


  // Gestion du déplacement d'un élément dans la structure
  const moveItem = useCallback((fromPath, toPath) => {
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev))
      
      const getItem = (structure, path) => {
        const indices = path.split('-').map(Number)
        return indices.reduce((acc, idx) => acc[idx].children, structure)[indices[indices.length -1]]
      }

      const fromIndices = fromPath.split('-').map(Number)
      const toIndices = toPath.split('-').map(Number)

      let fromParent = newStructure
      fromIndices.slice(0, -1).forEach(idx => fromParent = fromParent[idx].children)
      const [movedItem] = fromParent.splice(fromIndices[fromIndices.length -1], 1)

      let toParent = newStructure
      toIndices.slice(0, -1).forEach(idx => toParent = toParent[idx].children)
      toParent.splice(toIndices[toIndices.length -1], 0, movedItem)

      return newStructure
    })
  }, [])

  // Gestion de la sélection des textes liés
  const handleLinkedTextSelection = useCallback((sourceIndex, targetType, targetId) => {
    setSelectedLinkedTexts(prev => ({
      ...prev,
      [sourceIndex]: {
        ...prev[sourceIndex],
        [targetType]: prev[sourceIndex]?.[targetType]?.includes(targetId)
          ? prev[sourceIndex][targetType].filter(id => id !== targetId)
          : [...(prev[sourceIndex][targetType] || []), targetId]
      }
    }))
  }, [])

  // Gestion de la sélection de tous les textes liés
//   const handleSelectAll = useCallback((sourceIndex, targetType, select) => {
//     setSelectedLinkedTexts(prev => ({
//       ...prev,
//       [sourceIndex]: {
//         ...prev[sourceIndex],
//         [targetType]: select ? availableTexts[targetType].map(text => text.id) : []
//       }
//     }))
//   }, [availableTexts])

  // Rendu du contenu en fonction de l'étape actuelle
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
              <Upload className="w-16 h-16 text-blue-500" />
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
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {error && (
              <div className="text-red-500 flex items-center gap-2 mt-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
          </motion.div>
        )
      case 3:
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Prévisualisation et sélection des textes</h3>
            <p>Nom du fichier : {file?.name}</p>
            <p>Type de texte : {selectedType}</p>
            <div className="h-[400px] w-full rounded-md border p-4 overflow-auto">
              {parsedTexts.map((text, index) => (
                <div key={index} className="mb-4 border-b pb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type={selectedType === "Législation" ? "radio" : "checkbox"}
                      id={`text-${index}`}
                      checked={selectedTexts.includes(index)}
                      onChange={() => handleTextSelection(index)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`text-${index}`} className="text-sm font-medium text-gray-700">
                      {selectedType === "Législation" ? text.Titre_legislation : text.Title}
                    </label>
                  </div>
                  {selectedType === "Législation" ? (
                    <div className="mt-2">
                      <p><strong>Date d'entrée en vigueur:</strong> {text["Date d'entrée en vigueur"] || "N/A"}</p>
                      <p><strong>Date dernière modification:</strong> {text["Date dernière modification"] || "N/A"}</p>
                      <p><strong>Code visé:</strong> {text["Code visé"] || "N/A"}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">{text.Content.substring(0, 200)}...</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )
      case 4:
        if (selectedType !== "Législation") return null
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Structuration de la législation</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-blue-100"></div>
              <span>Titre</span>
              <div className="w-4 h-4 bg-green-100"></div>
              <span>Chapitre</span>
              <div className="w-4 h-4 bg-yellow-100"></div>
              <span>Section</span>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className="h-[400px] w-full rounded-md border p-4 overflow-auto">
                {structure.map((item, index) => (
                  <StructureItem
                    key={index}
                    item={item}
                    path={`${index}`}
                    moveItem={moveItem}
                    addChild={addChild}
                    removeItem={removeItem}
                  />
                ))}
              </div>
            </DndProvider>
            <div className="flex justify-between mt-4">
              {['titre', 'chapitre', 'section'].map((type, idx) => (
                <button
                  key={idx}
                  onClick={() => addChild(-1, type)}
                  className={`px-4 py-2 bg-${type === 'titre' ? 'blue' : type === 'chapitre' ? 'green' : 'yellow'}-500 text-white rounded-md flex items-center`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Ajouter un {type}
                </button>
              ))}
            </div>
          </motion.div>
        )
      case 5:
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Lier les textes sélectionnés</h3>
            <div className="h-[400px] w-full rounded-md border p-4 overflow-auto">
              {selectedTexts.map((selectedIndex) => (
                <div key={selectedIndex} className="mb-4 border-b pb-4">
                  <h4 className="font-medium">
                    {selectedType === "Législation"
                      ? parsedTexts[selectedIndex].Titre_legislation
                      : parsedTexts[selectedIndex].Title}
                  </h4>
                  {textTypes.filter(type => type !== selectedType).map(type => (
                    <div key={type} className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">{type}</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {availableTexts[type]?.map(text => (
                          <button
                            key={text.id}
                            onClick={() => handleLinkedTextSelection(selectedIndex, type, text.id)}
                            className={`px-2 py-1 text-sm rounded-full ${
                              selectedLinkedTexts[selectedIndex]?.[type]?.includes(text.id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {text.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )
      case 6:
        return (
          <motion.div {...animationProps}>
            <h3 className="text-lg font-semibold">Confirmation</h3>
            <p>Type de texte : {selectedType}</p>
            <p>Fichier : {file?.name}</p>
            <h4 className="font-semibold">Textes sélectionnés et leurs liaisons :</h4>
            <div className="h-[300px] w-full rounded-md border p-4 overflow-auto">
              {selectedTexts.map(index => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">
                    {selectedType === "Législation"
                      ? parsedTexts[index].Titre_legislation
                      : parsedTexts[index].Title}
                  </p>
                  <ul className="list-disc list-inside pl-4">
                    {Object.entries(selectedLinkedTexts[index] || {}).map(([targetType, targetIds]) => (
                      <li key={targetType}>
                        {targetType}: {targetIds.map(id => 
                          availableTexts[targetType]?.find(text => text.id === id)?.title
                        ).join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {selectedType === "Législation" && (
              <div>
                <h4 className="font-semibold">Structure de la législation :</h4>
                <div className="h-[200px] w-full rounded-md border p-4 overflow-auto">
                  {structure.map((item, index) => (
                    <div key={index} className="mb-2">
                      <p><strong>{item.type}:</strong> {item.content}</p>
                      {item.children && (
                        <ul className="list-disc list-inside pl-4">
                          {item.children.map((child, childIndex) => (
                            <li key={childIndex}>{child.type}: {child.content}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )
      default:
        return null
    }
  }, [currentStep, selectedType, file, parsedTexts, selectedTexts, structure, availableTexts, selectedLinkedTexts, handleFileChange, handleTextSelection, handleLinkedTextSelection, addChild, moveItem, removeItem])

  // Rendu des indicateurs d'étapes
  const renderStepIndicators = useCallback(() => (
    <div className="flex justify-between items-center overflow-x-auto pb-4">
      {steps.map((step, index) => {
        if (index === 4 && selectedType !== "Législation") return null
        return (
          <div key={step} className="flex flex-col items-center mx-2">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? 'bg-blue-500 text-white'
                  : index === currentStep
                  ? 'bg-gray-300 text-gray-700'
                  : 'bg-gray-200 text-gray-400'
              }`}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                transition: { type: 'spring', stiffness: 500, damping: 30 }
              }}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </motion.div>
            <span className="text-xs mt-1 whitespace-nowrap">{step}</span>
          </div>
        )
      })}
    </div>
  ), [steps, currentStep, selectedType])

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {renderStepIndicators()}

      <AnimatePresence mode="wait">
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
      </AnimatePresence>

      {isImportComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="flex flex-col items-center gap-4 p-6 bg-green-100 rounded-lg"
        >
          <Check className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-bold text-green-700">Importation réussie !</h2>
          <p className="text-center text-green-600">
            Votre importation a été effectuée avec succès.
          </p>
        </motion.div>
      ) : (
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
            onClick={() => {
              if (currentStep === steps.length - 1) {
                setIsImportComplete(true)
              } else {
                setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
              }
            }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <FileText className="mr-2 h-4 w-4" /> Confirmer l'importation
              </>
            ) : (
              <>
                Suivant <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
// cgt