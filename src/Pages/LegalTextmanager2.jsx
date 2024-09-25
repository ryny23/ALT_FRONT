import React, { useState } from 'react'
import Select from 'react-select'
import ArticleImport from './ArticleImport'
import LegislationImport from './LegislationImport'
import DecisionImport from './DecisionImport'
import CommentaireImport from './CommentaireImport'

const textTypes = [
  { value: "Article", label: "Article" },
  { value: "Législation", label: "Législation" },
  { value: "Décision", label: "Décision" },
  { value: "Commentaire", label: "Commentaire" }
]

const LegalTextImporter = () => {
  const [selectedType, setSelectedType] = useState(null)

  const handleTypeSelection = (selected) => {
    setSelectedType(selected)
  }

  const renderImporter = () => {
    switch (selectedType?.value) {
      case "Article":
        return <ArticleImport />
      case "Législation":
        return <LegislationImport />
      case "Décision":
        return <DecisionImport />
      case "Commentaire":
        return <CommentaireImport />
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Importer de textes juridiques</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Choisissez le type de texte à importer :</label>
        <Select
          options={textTypes}
          value={selectedType}
          onChange={handleTypeSelection}
          className="w-full"
        />
      </div>
      {renderImporter()}
    </div>
  )
}

export default LegalTextImporter