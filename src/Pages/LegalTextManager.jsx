import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, FileText, Check } from 'lucide-react'
import ArticleImport from './ArticleImport'
// import LegislationImport from './LegislationImport'
// import DecisionImport from './DecisionImport'
// import CommentaireImport from './CommentaireImport'

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

export default function LegalTextmanager2() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedType, setSelectedType] = useState("")
  const [isImportComplete, setIsImportComplete] = useState(false)

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div className="flex flex-col items-center gap-4">
            <Upload className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold">Importer un texte juridique</h2>
            <p className="text-center text-gray-600">
              Cliquez sur "Suivant" pour commencer le processus d'importation.
            </p>
          </motion.div>
        )
      case 1:
        return (
          <motion.div className="flex flex-col gap-4">
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
      default:
        switch (selectedType) {
          case "Article":
            return <ArticleImport currentStep={currentStep} />
          case "Législation":
            return <LegislationImport currentStep={currentStep} />
          case "Décision":
            return <DecisionImport currentStep={currentStep} />
          case "Commentaire":
            return <CommentaireImport currentStep={currentStep} />
          default:
            return null
        }
    }
  }

  const renderStepIndicators = () => {
    const currentIndex = steps.findIndex(step => step === steps[currentStep])
    const prevStep = steps[currentIndex - 1]
    const nextStep = steps[currentIndex + 1]

    return (
      <div className="flex justify-center items-center space-x-4 mb-8">
        {prevStep && (
          <motion.div className="text-sm text-gray-500">
            {prevStep}
          </motion.div>
        )}
        <motion.div className="text-lg font-bold bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
          {currentStep + 1}
        </motion.div>
        {nextStep && (
          <motion.div className="text-sm text-gray-500">
            {nextStep}
          </motion.div>
        )}
      </div>
    )
  }

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
          <motion.div className="flex flex-col items-center gap-4 p-6 bg-green-100 rounded-lg">
            <Check className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold text-green-700">Importation en cours...</h2>
            <p className="text-center text-green-600">
              Votre importation est en cours de traitement. Cela pourrait prendre plusieurs heures. Vous pouvez continuer en cliquant sur le bouton ci-dessous.
            </p>
            <button
              onClick={() => {
                setCurrentStep(0)
                setSelectedType("")
                setIsImportComplete(false)
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
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
            }}
            disabled={currentStep === 1 && !selectedType}
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