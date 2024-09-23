import axios from 'axios'

const API_BASE_URL = "https://alt.back.qilinsa.com/wp-json/wp/v2"

export const api = {
  fetchTexts: async (type) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${type.toLowerCase()}s`)
      return response.data.map((item) => ({
        value: item.id.toString(),
        label: item.title?.rendered || item.acf?.titre || 'Sans titre',
        type
      }))
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${type}s:`, error)
      throw error
    }
  },

  importTexts: async (type, data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/import/${type.toLowerCase()}s`, data)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de l'importation des ${type}s:`, error)
      throw error
    }
  },

  updateTextStructure: async (type, id, structure) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${type.toLowerCase()}s/${id}`, { structure })
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la structure du ${type}:`, error)
      throw error
    }
  },

  linkTexts: async (sourceType, sourceId, linkedTexts) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/link-texts`, {
        sourceType,
        sourceId,
        linkedTexts
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la liaison des textes:', error)
      throw error
    }
  }
}
