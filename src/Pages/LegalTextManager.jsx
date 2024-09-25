import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Plus, Trash2, Edit, Download, X, Search } from 'lucide-react'
import Papa from 'papaparse'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import axios from 'axios'
import Select from 'react-select'

const steps = [
  "Import",
  "Sélectionner le type",
  "Charger le fichier",
  "Prévisualisation",
  "Lier les textes",
  "Structuration",
  "Confirmation"
]

const textTypes = ["Article", "Législation", "Décision", "Commentaire"]

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2"

const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const StructureItem = ({ item, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TEXT',
    drop: (droppedItem) => onDrop(droppedItem, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={`p-2 mb-2 border rounded ${isOver ? 'bg-green-100' : 'bg-white'}`}
    >
      <strong>{item.type}:</strong> {item.title}
      {item.children && item.children.length > 0 && (
        <div className="ml-4 mt-2">
          {item.children.map((child, index) => (
            <StructureItem key={index} item={child} onDrop={onDrop} />
          ))}
        </div>
      )}
    </div>
  )
}

const DraggableText = ({ text, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TEXT',
    item: { id: text.id, index, title: text.Title || text.title, type: text.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 border rounded cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      {text.Title || text.title}
    </div>
  )
}

const LinkedTextItem = ({ text, onDragStart, onRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'LINKED_TEXT',
    item: { type: 'LINKED_TEXT', text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      className="p-2 mb-2 border rounded-md bg-white flex justify-between items-center"
      onDragStart={() => onDragStart(text)}
    >
      <span>{text.type}: {text.title}</span>
      <button onClick={() => onRemove(text)} className="text-black">
        <X size={16} />
        <span className="sr-only">Remove</span>
      </button>
    </div>
  )
}

export default function LegalTextManager() {
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
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [editingPath, setEditingPath] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  const [bulkSelection, setBulkSelection] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkLinkedTexts, setBulkLinkedTexts] = useState({})
  const [selectedLegislation, setSelectedLegislation] = useState(null)
  const [legislationItems, setLegislationItems] = useState([])
  const [structuredTexts, setStructuredTexts] = useState({})

  useEffect(() => {
    const fetchTexts = async () => {
      const texts = {}
      for (const type of textTypes) {
        try {
          const response = await axios.get(`${API_BASE_URL}/${removeAccents(type.toLowerCase())}s`)
          texts[type] = response.data.map(item => ({
            id: item.id,
            title: item.title?.rendered || item.acf?.titre || 'Sans titre',
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
              const requiredHeaders = [
                "Titre_legislation",
                "Date d'entrée en vigueur",
                "Date dernière modification",
                "Code visé"
              ]
              const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))
              if (missingHeaders.length > 0) {
                errorMessage = `Le fichier CSV pour la législation doit contenir les colonnes suivantes : ${requiredHeaders.join(", ")}. Colonnes manquantes : ${missingHeaders.join(", ")}`
                isValid = false
              }
            } else {
              if (!headers.includes('Title') || !headers.includes('Content')) {
                errorMessage = "Le fichier CSV pour les articles, commentaires ou décisions doit contenir les colonnes 'Title' et 'Content'"
                isValid = false
              }
            }
          }
  
          if (isValid) {
            setParsedTexts(cleanedData)
            setError(null)
          } else {
            setError(errorMessage)
            setParsedTexts([])
            event.target.value = null // Réinitialise l'input file
          }
        }
      })
    }
  }, [selectedType])
  

  const buildStructure = (item, existingStructure) => {
    const newStructure = [...existingStructure]
    let currentLevel = newStructure

    const levels = ['Titre', 'Chapitre', 'Section', 'Texte lié']
    for (const level of levels) {
      if (item[level] && item[level].trim() !== '') {
        let element = currentLevel.find(el => el.type === level && el.content === item[level])
        if (!element) {
          element = { type: level, content: item[level], children: [] }
          currentLevel.push(element)
        }
        currentLevel = element.children
      }
    }

    if (item['Texte lié'] && item['Contenu'] && item['Type de texte']) {
      currentLevel.push({
        type: item['Type de texte'],
        content: item['Texte lié'],
        text: item['Contenu'],
        id: item['ID_WordPress'] || null
      })
    }

    return newStructure
  }

  const handleTextSelection = useCallback((index) => {
    setSelectedTexts(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
    if (!selectedLinkedTexts[index]) {
      setSelectedLinkedTexts(prev => ({ ...prev, [index]: [] }))
    }
  }, [selectedLinkedTexts])

  const addChild = useCallback((path, type) => {
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev))
      const indices = path === '-1' ? [] : path.split('-').map(Number)
      let current = newStructure
      for (let i = 0; i < indices.length; i++) {
        if (!current[indices[i]]) {
          return prev
        }
        current = current[indices[i]].children
      }
      current.push({ type, content: `Nouveau ${type}`, children: [] })
      return newStructure
    })
  }, [])

  const removeItem = useCallback((path) => {
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev))
      const indices = path.split('-').map(Number)
      const lastIndex = indices.pop()
      if (lastIndex === undefined) return prev
      let current = newStructure
      for (let i = 0; i < indices.length; i++) {
        if (!current[indices[i]]) {
          return prev
        }
        current = current[indices[i]].children
      }
      current.splice(lastIndex, 1)
      return newStructure
    })
  }, [])

  const moveItem = useCallback((fromPath, toPath) => {
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev))
      
      const getItem = (structure, path) => {
        const indices = path.split('-').map(Number)
        let current = structure
        for (let i = 0; i < indices.length; i++) {
          if (!current[indices[i]]) {
            return null
          }
          if (i === indices.length - 1) {
            return current[indices[i]]
          }
          current = current[indices[i]].children
        }
        return null
      }

      const removeItem = (structure, path) => {
        const indices = path.split('-').map(Number)
        const lastIndex = indices.pop()
        if (lastIndex === undefined) return null
        let current = structure
        for (let i = 0; i < indices.length; i++) {
          if (!current[indices[i]]) {
            return null
          }
          current = current[indices[i]].children
        }
        return current.splice(lastIndex, 1)[0]
      }

      const addItem = (structure, path, item) => {
        const indices = path.split('-').map(Number)
        let current = structure
        for (let i = 0; i < indices.length; i++) {
          if (!current[indices[i]]) {
            current[indices[i]] = { type: 'Titre', content: 'Nouveau Titre', children: [] }
          }
          if (i === indices.length - 1) {
            current[indices[i]].children.push(item)
            return
          }
          current = current[indices[i]].children
        }
      }

      const movedItem = removeItem(newStructure, fromPath)
      if (movedItem) {
        addItem(newStructure, toPath, movedItem)
      }

      return newStructure
    })
  }, [])

  const editItem = useCallback((path) => {
    const indices = path.split('-').map(Number)
    let current = structure
    for (let i = 0; i < indices.length; i++) {
      if (!current[indices[i]]) {
        return
      }
      if (i === indices.length - 1) {
        setEditingPath(path)
        setEditingContent(current[indices[i]].content)
        setShowEditPopup(true)
        return
      }
      current = current[indices[i]].children
    }
  }, [structure])

  const handleEditConfirm = useCallback(() => {
    if (!editingPath) return
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev))
      const indices = editingPath.split('-').map(Number)
      let current = newStructure
      for (let i = 0; i < indices.length; i++) {
        if (!current[indices[i]]) {
          return prev
        }
        if (i === indices.length - 1) {
          current[indices[i]].content = editingContent
          return newStructure
        }
        current = current[indices[i]].children
      }
      return prev
    })
    setShowEditPopup(false)
  }, [editingPath, editingContent])

  const handleLinkedText = useCallback((selectedIndex, newLinkedTexts, type) => {
    setSelectedLinkedTexts(prev => {
      const updatedLinkedTexts = { ...prev }
      if (!updatedLinkedTexts[selectedIndex]) {
        updatedLinkedTexts[selectedIndex] = []
      }
      if (type === "Législation") {
        // Remplacer la législation existante s'il y en a une
        updatedLinkedTexts[selectedIndex] = updatedLinkedTexts[selectedIndex].filter(text => text.type !== "Législation")
        updatedLinkedTexts[selectedIndex].push(...newLinkedTexts)
      } else {
        updatedLinkedTexts[selectedIndex] = [
          ...updatedLinkedTexts[selectedIndex].filter(text => text.type !== type),
          ...newLinkedTexts
        ]
      }
      return updatedLinkedTexts
    })

    if (type === "Législation" && newLinkedTexts.length > 0) {
      setSelectedLegislation(newLinkedTexts[0].id)
    }
  }, [])

  useEffect(() => {
    if (selectedLegislation) {
      const fetchLegislationItems = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/legislations/${selectedLegislation}`)
          const identifiers = res.data.acf.titre_ou_chapitre_ou_section_ou_articles
          const endpoints = ['titres', 'chapitres', 'sections', 'articles']

          const fetchData = async (id) => {
            for (let endpoint of endpoints) {
              try {
                const res = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`)
                if (res.data) return { ...res.data, endpoint }
              } catch (err) {
                // Continue to the next endpoint if not found
              }
            }
            return null
          }

          const detailsData = await Promise.all(identifiers.map(fetchData))
          const successfulItems = detailsData.filter(item => item !== null)
          setLegislationItems(successfulItems)
        } catch (err) {
          console.error('Failed to fetch legislation items:', err)
        }
      }

      fetchLegislationItems()
    }
  }, [selectedLegislation])

  useEffect(() => {
    if (bulkSelection) {
      const newSelectedLinkedTexts = {}
      selectedTexts.forEach(selectedIndex => {
        newSelectedLinkedTexts[selectedIndex] = Object.values(bulkLinkedTexts).flat()
      })
      setSelectedLinkedTexts(newSelectedLinkedTexts)
    }
  }, [bulkSelection, bulkLinkedTexts, selectedTexts])




  const exportStructure = useCallback(() => {
    const flattenStructure = (structure, parent = '') => {
      return structure.flatMap((item, index) => {
        const currentPath = parent ? `${parent}-${index}` : `${index}`
        const row = {
          Titre_legislation: parsedTexts[0].Titre_legislation,
          "Date d'entrée en vigueur": parsedTexts[0]["Date d'entrée en vigueur"],
          "Date dernière modification": parsedTexts[0]["Date dernière modification"],
          "Code visé": parsedTexts[0]["Code visé"],
          Titre: item.type === 'Titre' ? item.content : '',
          Chapitre: item.type === 'Chapitre' ? item.content : '',
          Section: item.type === 'Section' ? item.content : '',
          "Texte lié": ['Article', 'Décision', 'Commentaire'].includes(item.type) ? item.content : '',
          Contenu: ['Article', 'Décision', 'Commentaire'].includes(item.type) ? item.text : '',
          "Type de texte": ['Article', 'Décision', 'Commentaire'].includes(item.type) ? item.type : '',
          "ID_WordPress": item.id || ''
        }
        return [
          row,
          ...(item.children ? flattenStructure(item.children, currentPath) : [])
        ]
      })
    }

    const flatStructure = flattenStructure(structure)
    const csv = Papa.unparse(flatStructure)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'structure_exportee.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [structure, parsedTexts])

  const handleDrop = useCallback((droppedItem, targetItem) => {
    setStructuredTexts(prev => ({
      ...prev,
      [droppedItem.id]: {
        ...droppedItem,
        parent: {
          id: targetItem.id,
          type: targetItem.type,
          title: targetItem.title
        }
      }
    }))
  }, [])

  const handleBulkSelection = useCallback((select) => {
    setBulkSelection(select)
    if (!select) {
      setSelectedLinkedTexts({})
    }
  }, [])

  const handleBulkLinkedText = useCallback((type, selectedOptions) => {
    setBulkLinkedTexts(prev => ({
      ...prev,
      [type]: selectedOptions
    }))
  }, [])


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
          case 3:
            return (
              <motion.div {...animationProps}>
                <h3 className="text-lg font-semibold">Prévisualisation et sélection des textes</h3>
                <p>Nom du fichier : {file?.name}</p>
                <p>Type de texte : {selectedType}</p>
                {selectedType !== "Législation" && (
                  <div className="flex justify-between mb-2">
                    <button onClick={() => setSelectedTexts(parsedTexts.map((_, index) => index))} className="text-green-500">
                      Tout sélectionner
                    </button>
                    <button onClick={() => setSelectedTexts([])} className="text-green-500">
                      Tout désélectionner
                    </button>
                  </div>
                )}
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
              return (
                <motion.div {...animationProps}>
                  <h3 className="text-lg font-semibold">Lier les textes</h3>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bulkSelection}
                        onChange={(e) => handleBulkSelection(e.target.checked)}
                        className="mr-2"
                      />
                      Sélection en bloc
                    </label>
                  </div>
                  {bulkSelection ? (
                    <div className="space-y-4">
                      {textTypes.filter(type => type !== selectedType).map(type => (
                        <div key={type} className="mb-4">
                          <label className="block text-sm font-medium mb-1">{`Lier ${type}s:`}</label>
                          <Select
                            options={availableTexts[type]?.map(text => ({ value: text.id, label: text.title }))}
                            value={bulkLinkedTexts[type] || []}
                            onChange={(selectedOptions) => handleBulkLinkedText(type, selectedOptions)}
                            isMulti
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedTexts.map((selectedIndex) => (
                        <div key={selectedIndex} className="border rounded-md p-4">
                          <h4 className="font-medium mb-2">
                            {selectedType === "Législation" 
                              ? parsedTexts[selectedIndex].Titre_legislation 
                              : parsedTexts[selectedIndex].Title}
                          </h4>
                          {textTypes.filter(type => type !== selectedType).map(type => (
                            <div key={type} className="mb-4">
                              <label className="block text-sm font-medium mb-1">{`Lier ${type}s:`}</label>
                              <Select
                                options={availableTexts[type]?.map(text => ({ value: text.id, label: text.title }))}
                                value={selectedLinkedTexts[selectedIndex]?.filter(text => text.type === type).map(text => ({ value: text.id, label: text.title })) || []}
                                onChange={(selectedOptions) => {
                                  const newLinkedTexts = selectedOptions.map(option => ({
                                    id: option.value,
                                    title: option.label,
                                    type: type
                                  }))
                                  handleLinkedText(selectedIndex, newLinkedTexts, type)
                                }}
                                isMulti
                                className="w-full"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )

      
        
              case 5:
                if (selectedType !== "Législation") return null
                return (
                  <motion.div {...animationProps}>
                    <h3 className="text-lg font-semibold">Structuration</h3>
                    {selectedType === "Législation" && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-4 bg-green-100"></div>
                        <span>Titre</span>
                        <div className="w-4 h-4 bg-green-200"></div>
                        <span>Chapitre</span>
                        <div className="w-4 h-4 bg-green-300"></div>
                        <span>Section</span>
                        <div className="w-4 h-4 bg-green-400"></div>
                        <span>Article</span>
                        <div className="w-4 h-4 bg-green-500"></div>
                        <span>Décision</span>
                        <div className="w-4 h-4 bg-green-600"></div>
                        <span>Commentaire</span>
                      </div>
                    )}
                    <DndProvider backend={HTML5Backend}>
                      <div className="flex">
                        <div className="w-1/2 pr-4">
                          <h4 className="font-semibold mb-2">Textes à structurer :</h4>
                          <div className="h-[400px] rounded-md border p-4 overflow-auto">
                            {selectedTexts.map((index) => (
                              <DraggableText
                                key={index}
                                text={parsedTexts[index]}
                                index={index}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="w-1/2 pl-4">
                          <h4 className="font-semibold mb-2">Structure de la législation liée :</h4>
                          <div className="h-[400px] rounded-md border p-4 overflow-auto">
                            {legislationItems.map((item, index) => (
                              <StructureItem
                                key={index}
                                item={{
                                  id: item.id,
                                  type: item.endpoint,
                                  title: item.title?.rendered || item.acf?.titre,
                                  children: item.children || []
                                }}
                                onDrop={handleDrop}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Textes structurés :</h4>
                        <div className="h-[200px] rounded-md border p-4 overflow-auto">
                          {Object.entries(structuredTexts).map(([id, text]) => (
                            <div key={id} className="mb-2">
                              <strong>{text.title}</strong> lié à {text.parent.type}: {text.parent.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </DndProvider>
                    <button
                      onClick={exportStructure}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      <Download className="h-4 w-4 inline mr-2" />
                      Exporter la structure
                    </button>
                  </motion.div>
                )
        case 6:
          return (
            <motion.div {...animationProps}>
              <h3 className="text-lg font-semibold">Confirmation</h3>
              <p>Type de texte : {selectedType}</p>
              <p>Fichier : {file?.name}</p>
              <h4 className="font-semibold">Textes sélectionnés et leurs liaisons :</h4>
              <div className="h-[300px] rounded-md border p-4 overflow-auto">
                {selectedTexts.map(index => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">
                      {selectedType === "Législation"
                        ? parsedTexts[index].Titre_legislation
                        : parsedTexts[index].Title}
                    </p>
                    <ul className="list-disc list-inside pl-4">
                      {(bulkSelection ? Object.values(bulkLinkedTexts).flat() : selectedLinkedTexts[index] || []).map(item => (
                        <li key={item.id}>
                          {item.type}: {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {selectedType === "Législation" ? (
                <div>
                  <h4 className="font-semibold mt-4">Structure de la législation :</h4>
                  <div className="h-[200px] rounded-md border p-4 overflow-auto">
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
              ) : (
                <div>
                  <h4 className="font-semibold mt-4">Liaison avec la législation :</h4>
                  <div className="h-[200px] rounded-md border p-4 overflow-auto">
                    {Object.entries(structuredTexts).map(([id, text]) => (
                      <div key={id} className="mb-2">
                        <strong>{text.title}</strong> lié à {text.parent.type}: {text.parent.title}
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
  }, [currentStep, selectedType, parsedTexts, selectedTexts, availableTexts, selectedLinkedTexts, handleLinkedText, bulkSelection, bulkLinkedTexts, handleBulkLinkedText, structure, legislationItems])

  const renderStepIndicators = useCallback(() => (
    <div className="flex justify-between items-center overflow-x-auto pb-4">
      {steps.map((step, index) => {
        if (index === 5 && selectedType !== "Législation") return null
        return (
          <div key={step} className="flex flex-col items-center mx-2">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? 'bg-green-500 text-white'
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
            <h2 className="text-2xl font-bold text-green-700">Importation réussie !</h2>
            <p className="text-center text-green-600">
              Votre importation a été effectuée avec succès.
            </p>
            <button
              onClick={() => {
                setCurrentStep(0)
                setSelectedType("")
                setFile(null)
                setParsedTexts([])
                setSelectedTexts([])
                setStructure([])
                setIsImportComplete(false)
                setError(null)
                setSelectedLinkedTexts({})
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
                setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
              }
            }}
            disabled={error !== null}
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

      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Modifier le contenu</h3>
            <input
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditPopup(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
                Annuler
              </button>
              <button onClick={handleEditConfirm} className="px-4 py-2 bg-green-500 text-white rounded-md">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}