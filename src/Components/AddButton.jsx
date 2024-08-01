// FormExperience.jsx
import React, { useState } from 'react';

const FormExperience = () => {
  const [experiences, setExperiences] = useState([{ title: '', description: '' }]);
  
  const handleChange = (index, event) => {
    const newExperiences = experiences.map((exp, i) => 
      i === index ? { ...exp, [event.target.name]: event.target.value } : exp
    );
    setExperiences(newExperiences);
  };

  const handleAddExperience = () => {
    if (experiences.length < 3) {
      setExperiences([...experiences, { title: '', description: '' }]);
    }
  };

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {experiences.map((experience, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Titre du poste</label>
          <input
            type="text"
            name="title"
            value={experience.title}
            onChange={(event) => handleChange(index, event)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Description des missions</label>
          <textarea
            name="description"
            value={experience.description}
            onChange={(event) => handleChange(index, event)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
          />
          {experiences.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveExperience(index)}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              Supprimer cette expérience
            </button>
          )}
        </div>
      ))}
      {experiences.length < 3 && (
        <button
          type="button"
          onClick={handleAddExperience}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Ajouter une expérience
        </button>
      )}
    </div>
  );
};

export default FormExperience;
