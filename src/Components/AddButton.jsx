import React, { useState } from 'react';

const AddButton = () => {
  const [experiences, setExperiences] = useState([
    { titre: '', description: '' },
  ]);

  const handleAddExperience = () => {
    if (experiences.length < 3) {
      setExperiences([...experiences, { titre: '', description: '' }]);
    }
  };

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newExperiences = experiences.slice();
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  return (
    <div className="grid gap-6">
      {experiences.map((exp, index) => (
        <div key={index} className="mb-4 grid gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor={`experience-title-${index}`} className="block text-sm font-medium text-gray-700">
              Titre du poste
            </label>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            )}
          </div>
          <input
            className="flex h-10 w-3/4 rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            id={`experience-title-${index}`}
            placeholder="Titre du poste"
            value={exp.titre}
            onChange={(e) => handleChange(index, 'titre', e.target.value)}
          />
          <label htmlFor={`experience-description-${index}`} className="block text-sm font-medium text-gray-700 mt-2">
            Description des missions
          </label>
          <textarea
            className="flex min-h-[80px] w-3/4 rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            id={`experience-description-${index}`}
            rows="3"
            placeholder="Description des missions"
            value={exp.description}
            onChange={(e) => handleChange(index, 'description', e.target.value)}
          ></textarea>
        </div>
      ))}

      {experiences.length < 3 && (
        <button
          type="button"
          onClick={handleAddExperience}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Ajouter une expérience
        </button>
      )}
    </div>
  );
};

export default AddButton;