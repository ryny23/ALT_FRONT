<<<<<<< HEAD
import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Plus, Trash2, Edit, Download } from 'lucide-react'
=======
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Download, Edit, Trash, X, GripVertical, Link } from 'lucide-react'
>>>>>>> main
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

<<<<<<< HEAD
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
=======
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
>>>>>>> main
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
  const [isImportComplete, setIsImportComplete] = useState(false)
  const [error, setError] = useState(null)
  const [selectedLinkedTexts, setSelectedLinkedTexts] = useState({})
<<<<<<< HEAD
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [editingPath, setEditingPath] = useState(null)
  const [editingContent, setEditingContent] = useState("")
=======
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
>>>>>>> main

  useEffect(() => {
    const fetchTexts = async () => {
      const texts = {}
      for (const type of textTypes) {
        try {
<<<<<<< HEAD
          const response = await fetch(`${API_BASE_URL}/${removeAccents(type.toLowerCase())}s`)
          const data = await response.json()
          texts[type] = data.map(item => ({
            id: item.id,
            title: item.title?.rendered || item.acf?.titre || 'Sans titre',
=======
          const response = await axios.get(`${API_BASE_URL}/${removeAccents(type.toLowerCase())}s`)
          texts[type] = response.data.map(item => ({
            value: item.id.toString(),
            label: item.title?.rendered || item.acf?.titre || 'Sans titre',
>>>>>>> main
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
<<<<<<< HEAD

=======
  
>>>>>>> main
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
<<<<<<< HEAD
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
=======
              const structures = buildLegislationStructures(cleanedData)
              setLegislationStructures(structures)
              setParsedTexts(structures)

              // Extraire les textes liés de la législation
              const linkedTexts = cleanedData.filter(row => row['Texte lié'])
                .map(row => ({ id: row['Texte lié'], type: 'Texte lié' }))
              setLegislationLinkedTexts(linkedTexts)
            } else {
              setParsedTexts(cleanedData)
>>>>>>> main

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
<<<<<<< HEAD
=======
            setParsedTexts([])
            event.target.value = null
>>>>>>> main
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

<<<<<<< HEAD
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
=======
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
>>>>>>> main

  const handleTextSelection = useCallback((index) => {
    setSelectedTexts(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
<<<<<<< HEAD
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
=======
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
>>>>>>> main
    })
  }, [selectedLegislationIndex])

<<<<<<< HEAD
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

=======
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
  
>>>>>>> main
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
<<<<<<< HEAD
                      type="checkbox"
                      id={`text-${index}`}
                      checked={selectedTexts.includes(index)}
                      onChange={() => handleTextSelection(index)}
                      className="rounded text-blue-600 focus:ring-blue-500"
=======
                      type="radio"
                      id={`legislation-${index}`}
                      name="legislation"
                      value={index}
                      checked={selectedLegislationIndex === index}
                      onChange={() => setSelectedLegislationIndex(index)}
>>>>>>> main
                    />
                    <label htmlFor={`legislation-${index}`} className="ml-2">
                      {legislation.Titre_legislation}
                    </label>
                  </div>
<<<<<<< HEAD
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
=======
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
>>>>>>> main
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
<<<<<<< HEAD
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
=======
            <h4 className="font-semibold">Structure du texte avec ses liaisons :</h4>
            <div className="h-[300px] rounded-md border p-4 overflow-auto">
              {selectedType === "Législation" ? (
                <div>
                  <p className="font-semibold">{legislationStructures[selectedLegislationIndex]?.Titre_legislation}</p>
                  {legislationStructures[selectedLegislationIndex]?.structure.map((node, index) => (
                    <div key={index} className="ml-4">
                      <p>{node.type}: {node.content}</p>
>>>>>>> main
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
<<<<<<< HEAD
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
=======
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
>>>>>>> main
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
<<<<<<< HEAD
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
=======
            Nouvelle importation
          </button>
        </motion.div>
      )}
    </AnimatePresence>
>>>>>>> main

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
<<<<<<< HEAD
            disabled={error !== null}
=======
            disabled={
              error !== null || 
              (currentStep === 1 && !selectedType) ||
              (currentStep === 3 && selectedType === "Législation" && selectedLegislationIndex === null) ||
              (currentStep === 3 && selectedType !== "Législation" && selectedTexts.length === 0)
            }
            className="px-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
>>>>>>> main
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
<<<<<<< HEAD

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
=======
>>>>>>> main
    </div>
  )
}