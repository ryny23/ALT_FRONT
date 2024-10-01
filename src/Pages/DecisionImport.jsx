import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, FileText, Check, AlertTriangle, Download } from 'lucide-react';
import Papa from 'papaparse';
import axios from 'axios';
import Select from 'react-select';

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2";

const steps = [
  "Charger le fichier",
  "Prévisualisation",
  "Lier les textes",
  "Confirmation"
];

const removeAccentsAndLowerCase = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const DecisionImport = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [parsedDecisions, setParsedDecisions] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLinkedTexts, setSelectedLinkedTexts] = useState({});
  const [availableTexts, setAvailableTexts] = useState({});
  const [selectedLegislation, setSelectedLegislation] = useState(null);
  const [bulkSelection, setBulkSelection] = useState(false);
  const [bulkLinkedTexts, setBulkLinkedTexts] = useState({ articles: [], commentaires: [] });
  const [isImportComplete, setIsImportComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importError, setImportError] = useState(null);

  const generateFileName = () => {
    const now = new Date();
    const date = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}`;
    const time = `${now.getHours()}h${now.getMinutes()}min`;
    return `Decisions_${date}_${time}.csv`;
  };

  const handleFileChange = useCallback((event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8', // Ajout de l'encodage UTF-8
        complete: (results) => {
          const cleanedData = results.data.map(row => {
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
              cleanedRow[key.trim()] = row[key];
            });
            return cleanedRow;
          });

          if (results.errors.length > 0) {
            setError(`Erreur de parsing CSV: ${results.errors[0].message}`);
            setParsedDecisions([]);
          } else if (cleanedData.length === 0) {
            setError("Le fichier CSV est vide");
            setParsedDecisions([]);
          } else if (!validateCSVStructure(cleanedData)) {
            setError("La structure du fichier CSV est invalide");
            setParsedDecisions([]);
          } else {
            setParsedDecisions(cleanedData);
            setError(null);
          }
        }
      });
    }
  }, []);

  const validateCSVStructure = (data) => {
    const requiredColumns = ['Title', 'Content', 'Resume', 'Information'];
    return requiredColumns.every(column => data[0].hasOwnProperty(column) && data[0][column] !== '');
  };

  const handleDecisionSelection = useCallback((index) => {
    setSelectedDecisions(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  const handleLinkedText = useCallback((selectedIndex, newLinkedTexts, type) => {
    setSelectedLinkedTexts(prev => {
      const updatedLinkedTexts = { ...prev };
      if (!updatedLinkedTexts[selectedIndex]) {
        updatedLinkedTexts[selectedIndex] = [];
      }
      updatedLinkedTexts[selectedIndex] = updatedLinkedTexts[selectedIndex]
        .filter(text => text.type !== type)
        .concat(newLinkedTexts);
      return updatedLinkedTexts;
    });
  }, []);

  const handleBulkSelection = useCallback((select) => {
    setBulkSelection(select);
    if (!select) {
      setSelectedLinkedTexts({});
    }
  }, []);

  const handleBulkLinkedText = useCallback((selectedOptions, type) => {
    setBulkLinkedTexts(prev => ({
      ...prev,
      [type]: selectedOptions
    }));
    if (bulkSelection) {
      const newSelectedLinkedTexts = {};
      selectedDecisions.forEach(selectedIndex => {
        newSelectedLinkedTexts[selectedIndex] = [
          ...(newSelectedLinkedTexts[selectedIndex] || []),
          ...selectedOptions
        ];
      });
      setSelectedLinkedTexts(newSelectedLinkedTexts);
    }
  }, [bulkSelection, selectedDecisions]);

  const exportModifiedCSV = useCallback(() => {
    const exportData = selectedDecisions.map(index => {
      const decision = parsedDecisions[index];
      const exportRow = { ...decision };
      
      const linkedTexts = selectedLinkedTexts[index] || [];
      const articles = linkedTexts.filter(t => t.type === "Article").map(t => t.value);
      const commentaires = linkedTexts.filter(t => t.type === "Commentaire").map(t => t.value);
      
      exportRow.ID_articles = articles.join(',');
      exportRow.ID_commentaires = commentaires.join(',');
      
      if (selectedLegislation) {
        exportRow.ID_legislation = selectedLegislation.value;
      }
  
      return exportRow;
    });
  
    const csv = Papa.unparse(exportData, {
      encoding: 'UTF-8' // Ajout de l'encodage UTF-8 pour l'export
    });
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
    return { csv, blob };
  }, [selectedDecisions, parsedDecisions, selectedLinkedTexts, selectedLegislation]);

  const fetchAvailableTexts = useCallback(async () => {
    const textTypes = ["Législation", "Article", "Commentaire"];
    const texts = {};
    for (const type of textTypes) {
      try {
        const response = await axios.get(`${API_BASE_URL}/${removeAccentsAndLowerCase(type)}s`);
        texts[type] = response.data.map(item => ({
          value: item.id.toString(),
          label: item.title?.rendered || item.acf?.titre || 'Sans titre',
          type
        }));
      } catch (err) {
        console.error(`Erreur lors de la récupération des ${type}s:`, err);
        texts[type] = [];
      }
    }
    setAvailableTexts(texts);
  }, []);

  useEffect(() => {
    fetchAvailableTexts();
  }, [fetchAvailableTexts]);

  useEffect(() => {
    if (currentStep === 2) {
      const newSelectedLinkedTexts = {};
      selectedDecisions.forEach(index => {
        const decision = parsedDecisions[index];
        const linkedTexts = [];
  
        if (decision.ID_articles) {
          const articleIds = decision.ID_articles.split(',');
          articleIds.forEach(id => {
            const article = availableTexts["Article"]?.find(t => t.value === id);
            if (article) {
              linkedTexts.push(article);
            }
          });
        }
  
        if (decision.ID_commentaires) {
          const commentaireIds = decision.ID_commentaires.split(',');
          commentaireIds.forEach(id => {
            const commentaire = availableTexts["Commentaire"]?.find(t => t.value === id);
            if (commentaire) {
              linkedTexts.push(commentaire);
            }
          });
        }
  
        if (linkedTexts.length > 0) {
          newSelectedLinkedTexts[index] = linkedTexts;
        }
      });
  
      setSelectedLinkedTexts(newSelectedLinkedTexts);
  
      if (parsedDecisions.length > 0 && parsedDecisions[0].ID_legislation) {
        const legislationId = parsedDecisions[0].ID_legislation;
        const legislation = availableTexts["Législation"]?.find(t => t.value === legislationId);
        if (legislation) {
          setSelectedLegislation(legislation);
        }
      }
    }
  }, [currentStep, selectedDecisions, parsedDecisions, availableTexts]);

  const handleExportClick = () => {
    const { blob } = exportModifiedCSV();
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
  };

  const handleImportConfirmation = async () => {
    try {
      setImportStatus('pending');
      setImportError(null);

      const { csv } = exportModifiedCSV();
      const formData = new FormData();
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
      formData.append('file', blob, generateFileName());

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/importdecisions', formData, {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-500">Charger le fichier CSV</h2>
            <div className="bg-white p-4 rounded-md shadow">
              <p className="text-sm text-gray-600 mb-2">
                Le fichier CSV doit contenir les colonnes suivantes : Title, Content, Resume, Information (obligatoires),
                ID_articles, ID_commentaires, ID_legislation (optionnelles)
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
            <h2 className="text-xl font-semibold text-green-500">Prévisualisation des décisions</h2>
            <div className="bg-white p-4 rounded-md shadow max-h-96 overflow-y-auto">
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setSelectedDecisions(parsedDecisions.map((_, index) => index))}
                  className="text-green-500"
                >
                  Tout sélectionner
                </button>
                <button
                  onClick={() => setSelectedDecisions([])}
                  className="text-green-500"
                >
                  Tout désélectionner
                </button>
              </div>
              {parsedDecisions.map((decision, index) => (
                <div key={index} className="mb-4 p-3 border-b last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`decision-${index}`}
                        checked={selectedDecisions.includes(index)}
                        onChange={() => handleDecisionSelection(index)}
                        className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`decision-${index}`} className="text-sm font-medium text-gray-700">
                        {decision.Title}
                      </label>
                    </div>
                    {(decision.ID_articles || decision.ID_commentaires || decision.ID_legislation) && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Déjà lié</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{decision.Content.substring(0, 100)}...</p>
                  <p className="mt-1 text-xs text-blue-500">Résumé: {decision.Resume}</p>
                  <p className="mt-1 text-xs text-green-500">Information: {decision.Information}</p>
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lier à une législation :</label>
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
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Liaison en bloc</span>
                </label>
              </div>
              {bulkSelection ? (
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lier les articles en bloc :</label>
                    <Select
                      options={availableTexts["Article"] || []}
                      value={bulkLinkedTexts.articles}
                      onChange={(selected) => handleBulkLinkedText(selected, 'articles')}
                      isMulti
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lier les commentaires en bloc :</label>
                    <Select
                      options={availableTexts["Commentaire"] || []}
                      value={bulkLinkedTexts.commentaires}
                      onChange={(selected) => handleBulkLinkedText(selected, 'commentaires')}
                      isMulti
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                selectedDecisions.map((selectedIndex) => {
                  const decision = parsedDecisions[selectedIndex]
                  return (
                    <div key={selectedIndex} className="border rounded-md p-4 mb-4">
                      <h4 className="font-medium mb-2">{decision.Title}</h4>
                      {["Article", "Commentaire"].map(type => {
                        const linkedIds = decision[`ID_${type.toLowerCase()}s`]
                        const preselectedOptions = linkedIds
                          ? availableTexts[type].filter(text => linkedIds.split(',').includes(text.value))
                          : []
                        return (
                          <div key={type} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{`Lier ${type}s:`}</label>
                            <Select
                              options={availableTexts[type] || []}
                              value={selectedLinkedTexts[selectedIndex]?.filter(text => text.type === type) || preselectedOptions}
                              onChange={(selectedOptions) => handleLinkedText(selectedIndex, selectedOptions, type)}
                              isMulti
                              className="w-full"
                            />
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        );
      case 3:
        if (!parsedDecisions.length || !selectedDecisions.length) return null
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-500">Confirmation</h2>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-lg font-medium mb-2">Récapitulatif de l'importation</h3>
              <p>Nombre de décisions sélectionnées : {selectedDecisions.length}</p>
              <p>Législation liée : {selectedLegislation?.label || "Aucune"}</p>
              
              <h4 className="text-md font-medium mt-4 mb-2">Décisions et leurs liaisons :</h4>
              {bulkSelection ? (
                <div>
                  <ul className="list-disc list-inside">
                    {selectedDecisions.map((index) => (
                      <li key={index}>{parsedDecisions[index].Title}</li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <h5 className="font-medium">Articles liés :</h5>
                    <ul className="list-disc list-inside ml-4">
                      {bulkLinkedTexts.articles.map((article, i) => (
                        <li key={i}>{article.label}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h5 className="font-medium">Commentaires liés :</h5>
                    <ul className="list-disc list-inside ml-4">
                      {bulkLinkedTexts.commentaires.map((commentaire, i) => (
                        <li key={i}>{commentaire.label}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                selectedDecisions.map((index) => {
                  const decision = parsedDecisions[index];
                  return (
                    <div key={index} className="mb-4 bg-gray-50 p-3 rounded-md">
                      <h5 className="font-medium">{decision.Title}</h5>
                      <p className="text-sm text-gray-500">Résumé : {decision.Resume}</p>
                      <p className="text-sm text-gray-500">Information : {decision.Information}</p>
                      {["Article", "Commentaire"].map(type => (
                        <div key={type}>
                          <h6 className="font-medium text-sm mt-2">{type}s liés :</h6>
                          <ul className="list-disc list-inside ml-4">
                            {selectedLinkedTexts[index]?.filter(text => text.type === type).map((text, i) => (
                              <li key={i}>{text.label}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Veuillez vérifier que toutes les informations ci-dessus sont correctes avant de procéder à l'importation.</p>
              <button
                onClick={handleExportClick}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                <Download className="inline-block mr-2 h-4 w-4" />
                Exporter le nouveau fichier
              </button>
            </div>
          </div>
        );
      default:
        return null
    }
  }

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
  ), [steps, currentStep])

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
              disabled={importStatus === 'pending' || !parsedDecisions.length}
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
              disabled={error !== null}
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
  )
}

export default DecisionImport;