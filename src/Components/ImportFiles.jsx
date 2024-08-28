import { useState } from "react"
import { HiOutlineUpload } from "react-icons/hi" // Importation des icônes modernes pour améliorer l'interface utilisateur

const ImportFiles = () => {
  const [fileType, setFileType] = useState("legislation")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileTypeChange = (value) => {
    setFileType(value)
  }

  const handleImport = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier à importer.")
      return
    }
    setLoading(true)
    try {
      await importCSVAndCreatePosts(file, fileType)
      setError(null)
      setSuccessMessage("Le fichier a été importé avec succès !")
    } catch (err) {
      setError("Une erreur s'est produite lors de l'importation. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const importCSVAndCreatePosts = async (file, fileType) => {
    console.log(`Importation du fichier : ${file.name} de type ${fileType}`)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulation d'un délai
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Importation de données</h2>
          <p className="text-sm text-gray-500 mb-6">Importez des fichiers CSV pour créer des publications.</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="file-type" className="block text-sm font-medium text-gray-700">Type de publication</label>
              <select
                id="file-type"
                value={fileType}
                onChange={(e) => handleFileTypeChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="legislation">Législation</option>
                <option value="comments">Commentaires</option>
                <option value="decisions">Décisions</option>
                <option value="articles">Articles</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">Fichier CSV</label>
              <input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleImport}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-primary-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Importation en cours..." : <><HiOutlineUpload className="w-5 h-5 mr-2" /> Importer</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportFiles;
