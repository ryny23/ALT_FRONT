import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Download, Edit, X, GripVertical, Link } from 'lucide-react';
import Papa from 'papaparse';
import axios from 'axios';
import Select from 'react-select';

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2";

const steps = [
  "Charger le fichier",
  "Prévisualisation",
  "Lier les textes",
  "Structurer la législation",
  "Confirmation"
];

const LegislationNode = React.memo(({ node, onEdit, onDelete, canEdit, onDragEnd }) => {
  return (
    <Reorder.Item value={node} id={node.id} onDragEnd={onDragEnd}>
      <div className={`flex items-center space-x-2 mb-2 p-2 border rounded ${canEdit ? 'cursor-move' : ''}`}>
        {canEdit && <GripVertical className="text-gray-400" />}
        <span>{node.type}: {node.content}</span>
        {canEdit && (
          <>
            <button onClick={() => onEdit(node)} className="px-2 py-1 bg-blue-500 text-white rounded">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(node)} className="px-2 py-1 bg-red-500 text-white rounded">
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </Reorder.Item>
  );
});

const LegislationImport = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [parsedLegislations, setParsedLegislations] = useState([]);
  const [selectedLegislationIndex, setSelectedLegislationIndex] = useState(null);
  const [error, setError] = useState(null);
  const [legislationStructures, setLegislationStructures] = useState([]);
  const [canEditStructure, setCanEditStructure] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isImportComplete, setIsImportComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importError, setImportError] = useState(null);
  const [availableTexts, setAvailableTexts] = useState({});
  const [selectedLinkedTexts, setSelectedLinkedTexts] = useState([]);

  const generateFileName = () => {
    const now = new Date();
    const date = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}`;
    const time = `${now.getHours()}h${now.getMinutes()}min`;
    return `Legislation_${date}_${time}.csv`;
  };

  const checkExistingLegislations = async (legislations) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/legislations`);
      const existingLegislations = response.data;
      
      const updatedLegislations = legislations.map(legislation => {
        const existingLegislation = existingLegislations.find(existing => 
          existing.title.rendered === legislation.Titre_legislation
        );

        if (existingLegislation) {
          return { ...legislation, exists: true, id: existingLegislation.id };
        }

        return legislation;
      });

      return updatedLegislations;
    } catch (error) {
      console.error("Erreur lors de la vérification des législations existantes:", error);
      setError("Impossible de vérifier les législations existantes");
      return legislations;
    }
  };

  const handleFileChange = useCallback(async (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const cleanedData = results.data.map(row => {
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
              cleanedRow[key.trim()] = row[key];
            });
            return cleanedRow;
          });

          if (results.errors.length > 0) {
            setError(`Erreur de parsing CSV: ${results.errors[0].message}`);
            setParsedLegislations([]);
          } else if (cleanedData.length === 0) {
            setError("Le fichier CSV est vide");
            setParsedLegislations([]);
          } else if (!validateCSVStructure(cleanedData)) {
            setError("La structure du fichier CSV est invalide");
            setParsedLegislations([]);
          } else {
            const checkedLegislations = await checkExistingLegislations(cleanedData);
            setParsedLegislations(checkedLegislations);
            const structures = buildLegislationStructures(checkedLegislations);
            setLegislationStructures(structures);
            setError(null);
          }
        }
      });
    }
  }, []);

  const validateCSVStructure = (data) => {
    const requiredColumns = ['Titre_legislation', 'Date_entree', 'Code_visee', 'Titre', 'Chapitre', 'Section', 'Article'];
    return requiredColumns.every(column => data[0].hasOwnProperty(column));
  };

  const buildLegislationStructures = useCallback((data) => {
    const structures = [];
    let currentStructure = null;
    let currentTitle = '';
    let currentChapter = '';
    let currentSection = '';

    data.forEach((row) => {
      if (!currentStructure || row.Titre_legislation !== currentStructure.Titre_legislation) {
        if (currentStructure) {
          structures.push(currentStructure);
        }
        currentStructure = {
          Titre_legislation: row.Titre_legislation,
          "Date d'entrée en vigueur": row.Date_entree,
          "Code visé": row.Code_visee,
          structure: [],
          exists: row.exists,
          id: row.id
        };
        currentTitle = '';
        currentChapter = '';
        currentSection = '';
      }

      if (row.Titre && row.Titre !== currentTitle) {
        currentTitle = row.Titre;
        currentStructure.structure.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'Titre',
          content: row.Titre,
        });
      }

      if (row.Chapitre && row.Chapitre !== currentChapter) {
        currentChapter = row.Chapitre;
        currentStructure.structure.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'Chapitre',
          content: row.Chapitre,
        });
      }

      if (row.Section && row.Section !== currentSection) {
        currentSection = row.Section;
        currentStructure.structure.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'Section',
          content: row.Section,
        });
      }

      if (row.Article) {
        currentStructure.structure.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'Article',
          content: row.Article,
        });
      }
    });

    if (currentStructure) {
      structures.push(currentStructure);
    }

    return structures;
  }, []);

  const handleLegislationSelection = useCallback((index) => {
    if (!legislationStructures[index].exists) {
      setSelectedLegislationIndex(index);
    }
  }, [legislationStructures]);

  const handleEdit = useCallback((node) => {
    const newContent = prompt("Entrez le nouveau contenu:", node.content);
    if (newContent !== null) {
      setLegislationStructures(prevStructures => {
        return prevStructures.map((structure, index) => {
          if (index === selectedLegislationIndex) {
            return {
              ...structure,
              structure: structure.structure.map((item) => 
                item.id === node.id ? { ...item, content: newContent } : item
              )
            };
          }
          return structure;
        });
      });
    }
  }, [selectedLegislationIndex]);

  const handleDelete = useCallback((node) => {
    setLegislationStructures(prevStructures => {
      return prevStructures.map((structure, index) => {
        if (index === selectedLegislationIndex) {
          return {
            ...structure,
            structure: structure.structure.filter((item) => item.id !== node.id)
          };
        }
        return structure;
      });
    });
  }, [selectedLegislationIndex]);

  const handleDrop = useCallback((event, targetIndex) => {
    event.preventDefault();
    const droppedText = JSON.parse(event.dataTransfer.getData('text/plain'));
    setLegislationStructures(prevStructures => {
      const newStructures = [...prevStructures];
      if (selectedLegislationIndex !== null) {
        const currentStructure = [...newStructures[selectedLegislationIndex].structure];
        currentStructure.splice(targetIndex + 1, 0, {
          id: Math.random().toString(36).substr(2, 9),
          type: 'Article',
          content: droppedText.label,
          linkedTextId: droppedText.value
        });
        newStructures[selectedLegislationIndex].structure = currentStructure;
      }
      return newStructures;
    });
  }, [selectedLegislationIndex]);

  const exportModifiedCSV = useCallback(() => {
    if (selectedLegislationIndex !== null) {
      const selectedLegislation = legislationStructures[selectedLegislationIndex];
      let currentTitle = '';
      let currentChapter = '';
      let currentSection = '';
      
      const escapeValue = (value, forceNoQuotes = false) => {
        if (forceNoQuotes) return value;
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      const headerRow = 'Titre_legislation,Date_entree,Code_visee,Titre,Chapitre,Section,Article';
      
      const legislationInfoRow = `${selectedLegislation.Titre_legislation},${selectedLegislation["Date d'entrée en vigueur"]},${selectedLegislation["Code visé"]},,,,`;
      
      const exportData = selectedLegislation.structure.map((item) => {
        const baseInfo = [
          selectedLegislation.Titre_legislation,
          selectedLegislation["Date d'entrée en vigueur"],
          selectedLegislation["Code visé"],
          '',
          '',
          '',
          ''
        ];

        switch (item.type) {
          case 'Titre':
            currentTitle = item.content;
            currentChapter = '';
            currentSection = '';
            baseInfo[3] = item.content;
            break;
          case 'Chapitre':
            currentChapter = item.content;
            currentSection = '';
            baseInfo[4] = item.content;
            break;
          case 'Section':
            currentSection = item.content;
            baseInfo[5] = item.content;
            break;
          case 'Article':
            baseInfo[6] = item.linkedTextId ? `${item.linkedTextId}` : item.content;
            break;
        }

        baseInfo[3] = currentTitle;
        baseInfo[4] = currentChapter;
        baseInfo[5] = currentSection;

        return baseInfo.map((value, index) => escapeValue(value, index < 3)).join(',');
      });

      const isFirstRowLegislationInfo = exportData.length > 0 &&
        exportData[0].split(',').slice(3).every(val => val === '');

      const allRows = [
        headerRow,
        ...(isFirstRowLegislationInfo ? [] : [legislationInfoRow]),
        ...exportData
      ].join('\r\n');

      const blob = new Blob(["\uFEFF" + allRows], { type: 'text/csv;charset=utf-8;' });
      return { csv: allRows, blob };
    }
    return null;
  }, [legislationStructures, selectedLegislationIndex]);
  
  const handleExportClick = () => {
    const result = exportModifiedCSV();
    if (result) {
      const { blob } = result;
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', generateFileName());
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  
  const handleImportConfirmation = async () => {
    try {
      setImportStatus('pending');
      setImportError(null);
  
      const result = exportModifiedCSV();
      if (!result) {
        throw new Error('Aucune législation sélectionnée pour l\'exportation');
      }
  
      const { csv } = result;
      const formData = new FormData();
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
      formData.append('file', blob, generateFileName());
  
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }
  
      const response = await axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/importlegislations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.status === 200) {
        setImportStatus('success');
        setIsImportComplete(true);
      } else {
        throw new Error('Réponse inattendue du serveur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      setImportStatus('error');
      setImportError(error.message || 'Une erreur est survenue lors de l\'importation');
    }
  };

  const fetchAvailableTexts = useCallback(async () => {
    try {
      const [articlesResponse, decisionsResponse, commentairesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/articles`),
        axios.get(`${API_BASE_URL}/decisions`),
        axios.get(`${API_BASE_URL}/commentaires`)
      ]);

      setAvailableTexts({
        articles: articlesResponse.data.map(article => ({
          value: article.id.toString(),
          label: article.title.rendered,
          type: 'Article'
        })),
        decisions: decisionsResponse.data.map(decision => ({
          value: decision.id.toString(),
          label: decision.title.rendered,
          type: 'Décision'
        })),
        commentaires: commentairesResponse.data.map(commentaire => ({
          value: commentaire.id.toString(),
          label: commentaire.title.rendered,
          type: 'Commentaire'
        }))
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des textes:', error);
      setError('Erreur lors de la récupération des textes disponibles');
    }
  }, []);

  useEffect(() => {
    fetchAvailableTexts();
  }, [fetchAvailableTexts]);

  const handleLinkedTextSelection = useCallback((selectedOptions) => {
    setSelectedLinkedTexts(selectedOptions);
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-500">Charger le fichier CSV</h2>
            <div className="bg-white p-4 rounded-md shadow">
              <p className="text-sm text-gray-600 mb-2">
                Le fichier CSV doit contenir les colonnes suivantes : Titre_legislation, Date_entree, Code_visee, Titre, Chapitre, Section, Article
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
            <h2 className="text-xl font-semibold text-green-500">Prévisualisation des législations</h2>
            <div className="bg-white p-4 rounded-md shadow max-h-96 overflow-y-auto">
              {legislationStructures.map((legislation, index) => (
                <div key={index} className={`mb-4 p-3 border-b last:border-b-0 ${legislation.exists ? 'bg-red-100' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`legislation-${index}`}
                        checked={selectedLegislationIndex === index}
                        onChange={() => handleLegislationSelection(index)}
                        disabled={legislation.exists}
                        className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label htmlFor={`legislation-${index}`} className="text-sm font-medium text-gray-700">
                        {legislation.Titre_legislation}
                      </label>
                    </div>
                    {legislation.exists && (
                      <span className="bg-red-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Existant</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-blue-500">Date d'entrée : {legislation["Date d'entrée en vigueur"]}</p>
                  <p className="mt-1 text-xs text-green-500">Code visé : {legislation["Code visé"]}</p>
                  <p className="mt-1 text-xs">Nombre d'éléments : {legislation.structure.length}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-500">Lier les textes</h2>
            <div className="bg-white p-4 rounded-md shadow">
              <Select
                isMulti
                options={[...availableTexts.articles, ...availableTexts.decisions, ...availableTexts.commentaires]}
                value={selectedLinkedTexts}
                onChange={handleLinkedTextSelection}
                placeholder="Sélectionnez les textes à lier"
                className="mb-4"
              />
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Textes sélectionnés :</h3>
                <ul className="list-disc list-inside">
                  {selectedLinkedTexts.map((text) => (
                    <li key={text.value}>{text.label} ({text.type})</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-500">Structurer la législation</h2>
            {selectedLegislationIndex !== null && (
              <div className="flex space-x-4">
                <div className="w-2/3 border p-4 rounded">
                  <h4 className="font-medium mb-2">Structure de la législation</h4>
                  <Reorder.Group
                    axis="y"
                    onReorder={(newOrder) => {
                      setLegislationStructures(prevStructures => {
                        const newStructures = [...prevStructures];
                        newStructures[selectedLegislationIndex] = {
                          ...newStructures[selectedLegislationIndex],
                          structure: newOrder
                        };
                        return newStructures;
                      });
                    }}
                    values={legislationStructures[selectedLegislationIndex]?.structure || []}
                  >
                    {legislationStructures[selectedLegislationIndex]?.structure.map((node, index) => (
                      <div
                        key={node.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <LegislationNode
                          node={node}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          canEdit={canEditStructure}
                          onDragEnd={() => {/* Logique de mise à jour si nécessaire */}}
                        />
                      </div>
                    ))}
                  </Reorder.Group>
                </div>
                <div className="w-1/3 border p-4 rounded">
                  <h4 className="font-medium mb-2">Textes liés</h4>
                  {selectedLinkedTexts.map((text) => (
                    <div
                      key={text.value}
                      className="mb-2 p-2 border rounded cursor-move"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify(text));
                      }}
                    >
                      {text.label} ({text.type})
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  if (!canEditStructure) {
                    setShowWarning(true);
                  } else {
                    setCanEditStructure(false);
                  }
                }}
                className={`px-4 py-2 rounded-md ${
                  canEditStructure
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {canEditStructure ? 'Désactiver la modification' : 'Modifier la structure'}
              </button>
              <button
                onClick={handleExportClick}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                <Download className="h-4 w-4 inline mr-2" />
                Exporter le CSV modifié
              </button>
            </div>
            {showWarning && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="text-lg font-bold mb-4">Attention</h4>
                  <p>Modifier la structure d'un texte juridique est une action conséquente. Êtes-vous sûr de vouloir continuer ?</p>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowWarning(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        setCanEditStructure(true);
                        setShowWarning(false);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        if (!legislationStructures.length || selectedLegislationIndex === null) return null;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-500">Confirmation</h2>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-lg font-medium mb-2">Récapitulatif de l'importation</h3>
              <p>Législation sélectionnée : {legislationStructures[selectedLegislationIndex].Titre_legislation}</p>
              <p>Nombre d'éléments : {legislationStructures[selectedLegislationIndex].structure.length}</p>
              
              <h4 className="text-md font-medium mt-4 mb-2">Structure de la législation :</h4>
              <div className="max-h-60 overflow-y-auto">
                {legislationStructures[selectedLegislationIndex].structure.map((item, index) => (
                  <div key={index} className="ml-4">
                    <p>{item.type}: {item.content} {item.linkedTextId ? `(ID: ${item.linkedTextId})` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Veuillez vérifier que toutes les informations ci-dessus sont correctes avant de procéder à l'importation.</p>
              <button
                onClick={handleExportClick}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                <Download className="inline-block mr-2 h-4 w-4" />
                Exporter le CSV modifié
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderStepIndicators = useCallback(() => (
    <div className="flex justify-between items-center overflow-x-auto pb-4">
      {steps.map((step, index) => (
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
      ))}
    </div>
  ), [currentStep]);

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
              Votre importation a été prise en compte et sera exécutée en arrière-plan.
              Cela peut prendre plusieurs heures. Nous vous tiendrons informé de l'avancement.
            </p>
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
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleImportConfirmation}
              disabled={importStatus === 'pending' || selectedLegislationIndex === null}
              className="px-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
            >
              {importStatus === 'pending' ? (
                'Importation en cours...'
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4 inline" /> Confirmer l'importation
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={error !== null || (currentStep === 1 && selectedLegislationIndex === null)}
              className="px-4 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
            >
              Suivant <ArrowRight className="ml-2 h-4 w-4 inline" />
            </button>
          )}
        </div>
      )}

      {importStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {importError}</span>
        </div>
      )}
    </div>
  );
};

export default LegislationImport;