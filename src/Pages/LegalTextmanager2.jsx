import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Plus, Trash2, Edit, Download } from 'lucide-react'
import Papa from 'papaparse'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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

const StructureItem = ({ item, path, moveItem, addChild, removeItem, editItem, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'STRUCTURE_ITEM',
    item: { path, type: 'STRUCTURE_ITEM' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ['STRUCTURE_ITEM', 'LINKED_TEXT'],
    hover(draggedItem, monitor) {
      if (draggedItem.type === 'STRUCTURE_ITEM' && draggedItem.path !== path) {
        moveItem(draggedItem.path, path)
        draggedItem.path = path
      }
    },
    drop(draggedItem, monitor) {
      if (draggedItem.type === 'LINKED_TEXT') {
        onDrop(draggedItem, path)
      }
    },
  })

  return (
    <div 
      ref={(node) => drag(drop(node))} 
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }} 
      className={`mb-2 p-2 border rounded-md ${
        item.type === 'Titre' ? 'bg-blue-100' : 
        item.type === 'Chapitre' ? 'bg-green-100' : 
        item.type === 'Section' ? 'bg-yellow-100' : 
        item.type === 'Article' ? 'bg-red-100' : 
        item.type === 'Décision' ? 'bg-purple-100' : 
        item.type === 'Commentaire' ? 'bg-orange-100' : 
        'bg-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{item.type}: {item.content}</span>
        <div>
          {['Titre', 'Chapitre', 'Section', 'Article', 'Décision', 'Commentaire'].map((type, idx) => (
            <button key={idx} onClick={() => addChild(path, type)} className={`mr-2 text-${
              type === 'Titre' ? 'blue' : 
              type === 'Chapitre' ? 'green' : 
              type === 'Section' ? 'yellow' : 
              type === 'Article' ? 'red' : 
              type === 'Décision' ? 'purple' : 
              'orange'
            }-500`}>
              <Plus size={16} />{type.charAt(0).toUpperCase()}
            </button>
          ))}
          <button onClick={() => editItem(path)} className="text-blue-500 mr-2">
            <Edit size={16} />
          </button>
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
              editItem={editItem}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const LinkedTextItem = ({ text, onDragStart }) => {
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
      className="p-2 mb-2 border rounded-md bg-gray-100"
      onDragStart={() => onDragStart(text)}
    >
      {text.type}: {text.title}
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

  useEffect(() => {
    const fetchTexts = async () => {
      const texts = {}
      for (const type of textTypes) {
        try {
          const response = await fetch(`${API_BASE_URL}/${removeAccents(type.toLowerCase())}s`)
          const data = await response.json()
          texts[type] = data.map(item => ({
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
                errorMessage = `Le fichier CSV pour la législation ne contient pas les colonnes suivantes : ${missingHeaders.join(", ")}`
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
            const processedData = cleanedData.reduce((acc, item) => {
              if (selectedType === "Législation") {
                const key = `${item.Titre_legislation}-${item["Date d'entrée en vigueur"]}-${item["Date dernière modification"]}`
                if (!acc.map.has(key)) {
                  acc.map.set(key, { ...item, structure: [] })
                }
                const existing = acc.map.get(key)
                const newStructure = buildStructure(item, existing.structure)
                existing.structure = newStructure
              } else {
                if (acc.map.has(item.Title)) {
                  acc.map.get(item.Title).Content += `\n\n${item.Content}`
                } else {
                  acc.map.set(item.Title, item)
                }
              }
              return acc
            }, { map: new Map() })

            const finalData = Array.from(processedData.map.values())
            setParsedTexts(finalData)
            if (selectedType === "Législation" && finalData[0]?.structure) {
              setStructure(finalData[0].structure)
            }
            setError(null)
          } else {
            setError(errorMessage)
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
        text: item['Contenu']
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

  const handleLinkedText = useCallback((sourceIndex, targetType, targetId) => {
    setSelectedLinkedTexts(prev => {
      const newLinkedTexts = { ...prev }
      if (!newLinkedTexts[sourceIndex]) {
        newLinkedTexts[sourceIndex] = []
      }
      const existingIndex = newLinkedTexts[sourceIndex].findIndex(item => item.id === targetId)
      if (existingIndex > -1) {
        newLinkedTexts[sourceIndex].splice(existingIndex, 1)
      } else {
        newLinkedTexts[sourceIndex].push({
          id: targetId,
          type: targetType,
          title: availableTexts[targetType]?.find(text => text.id === targetId)?.title
        })
      }
      return newLinkedTexts
    })
  }, [availableTexts])

  const handleSelectAll = useCallback((sourceIndex, targetType, select) => {
    setSelectedLinkedTexts(prev => {
      const newLinkedTexts = { ...prev }
      if (!newLinkedTexts[sourceIndex]) {
        newLinkedTexts[sourceIndex] = []
      }
      if (select) {
        const newTexts = availableTexts[targetType]
          ?.filter(text => !newLinkedTexts[sourceIndex].some(item => item.id === text.id))
          .map(text => ({
            id: text.id,
            type: targetType,
            title: text.title
          }))
        newLinkedTexts[sourceIndex] = [...newLinkedTexts[sourceIndex], ...(newTexts || [])]
      } else {
        newLinkedTexts[sourceIndex] = newLinkedTexts[sourceIndex].filter(item => item.type !== targetType)
      }
      return newLinkedTexts
    })
  }, [availableTexts])

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

  const handleDrop = useCallback((draggedItem, targetPath) => {
    setStructure(prev => {
      const newStructure = JSON.parse(JSON.stringify(prev))
      const indices = targetPath.split('-').map(Number)
      let current = newStructure
      for (let i = 0; i < indices.length; i++) {
        if (!current[indices[i]]) {
          return prev
        }
        if (i === indices.length - 1) {
          current[indices[i]].children.push({
            type: draggedItem.text.type,
            content: draggedItem.text.title,
            text: draggedItem.text.content
          })
          return newStructure
        }
        current = current[indices[i]].children
      }
      return prev
    })
    setSelectedLinkedTexts(prev => {
      const newLinkedTexts = { ...prev }
      Object.keys(newLinkedTexts).forEach(key => {
        newLinkedTexts[Number(key)] = newLinkedTexts[Number(key)].filter(item => item.id !== draggedItem.text.id)
      })
      return newLinkedTexts
    })
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
            {selectedType !== "Législation" && (
              <div className="flex justify-between mb-2">
                <button onClick={() => setSelectedTexts(parsedTexts.map((_, index) => index))} className="text-blue-500">
                  Tout sélectionner
                </button>
                <button onClick={() => setSelectedTexts([])} className="text-blue-500">
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
                      <div className="mt-2">
                        <h4 className="font-semibold">Structure:</h4>
                        <ul className="list-disc list-inside">
                          {text.structure.map((item, i) => (
                            <li key={i}>{item.type}: {item.content}</li>
                          ))}
                        </ul>
                      </div>
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
            <div className="space-y-4">
              {selectedTexts.map((selectedIndex) => (
                <div key={selectedIndex} className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">
                    {selectedType === "Législation" 
                      ? parsedTexts[selectedIndex].Titre_legislation 
                      : parsedTexts[selectedIndex].Title}
                  </h4>
                  {textTypes.filter(type => type !== selectedType).map(type => (
                    <div key={type} className="mt-2">
                      <h5 className="font-medium">{type}s</h5>
                      <div className="flex flex-wrap gap-2">
                        {availableTexts[type]?.map(text => (
                          <button
                            key={text.id}
                            onClick={() => handleLinkedText(selectedIndex, type, text.id)}
                            className={`px-3 py-1 text-sm rounded-full ${
                              selectedLinkedTexts[selectedIndex]?.some(item => item.id === text.id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {text.title}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2">
                        <button onClick={() => handleSelectAll(selectedIndex, type, true)} className="text-blue-500 mr-2">Tout sélectionner</button>
                        <button onClick={() => handleSelectAll(selectedIndex, type, false)} className="text-blue-500">Tout désélectionner</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )
      case 5:
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
              <div className="w-4 h-4 bg-red-100"></div>
              <span>Article</span>
              <div className="w-4 h-4 bg-purple-100"></div>
              <span>Décision</span>
              <div className="w-4 h-4 bg-orange-100"></div>
              <span>Commentaire</span>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className="flex">
                <div className="w-3/4 h-[400px] rounded-md border p-4 overflow-auto">
                  {structure.map((item, index) => (
                    <StructureItem
                      key={index}
                      item={item}
                      path={`${index}`}
                      moveItem={moveItem}
                      addChild={addChild}
                      removeItem={removeItem}
                      editItem={editItem}
                      onDrop={handleDrop}
                    />
                  ))}
                </div>
                <div className="w-1/4 h-[400px] rounded-md border p-4 overflow-auto ml-4">
                  <h4 className="font-semibold mb-2">Textes liés</h4>
                  {Object.entries(selectedLinkedTexts).flatMap(([sourceIndex, texts]) =>
                    texts.map((text, index) => (
                      <LinkedTextItem key={`${sourceIndex}-${index}`} text={text} onDragStart={() => {}} />
                    ))
                  )}
                </div>
              </div>
            </DndProvider>
            <button
              onClick={exportStructure}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md flex items-center"
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
            <div className="h-[300px] w-full rounded-md border p-4 overflow-auto">
              {selectedTexts.map(index => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">
                    {selectedType === "Législation"
                      ? parsedTexts[index].Titre_legislation
                      : parsedTexts[index].Title}
                  </p>
                  <ul className="list-disc list-inside pl-4">
                    {selectedLinkedTexts[index]?.map(item => (
                      <li key={item.id}>
                        {item.type}: {item.title}
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
  }, [currentStep, selectedType, file, parsedTexts, selectedTexts, structure, availableTexts, selectedLinkedTexts, handleFileChange, handleTextSelection, handleLinkedText, addChild, moveItem, removeItem, editItem, handleSelectAll, exportStructure, handleDrop])

  const renderStepIndicators = useCallback(() => (
    <div className="flex justify-between items-center overflow-x-auto pb-4">
      {steps.map((step, index) => {
        if (index === 5 && selectedType !== "Législation") return null
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
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Nouvelle importation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isImportComplete && (
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
            disabled={error !== null}
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

      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Modifier le contenu</h3>
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full h-32 p-2 border rounded-md"
            />
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowEditPopup(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2">
                Annuler
              </button>
              <button
                onClick={handleEditConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}