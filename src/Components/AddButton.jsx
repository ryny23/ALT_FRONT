import React, { useState } from 'react';

const AddButton = () => {
  const [titreexp1, setTitreExp1] = useState('');
  const [titreexp2, setTitreExp2] = useState('');
  const [titreexp3, setTitreExp3] = useState('');
  const [desexp1, setDesExp1] = useState('');
  const [desexp2, setDesExp2] = useState('');
  const [desexp3, setDesExp3] = useState('');
  const [visibleExperiences, setVisibleExperiences] = useState(1);

  const handleAddExperience = () => {
    if (visibleExperiences < 3) {
      setVisibleExperiences(visibleExperiences + 1);
    }
  };

  const handleRemoveExperience = (index) => {
    if (visibleExperiences > 1) {
      setVisibleExperiences(visibleExperiences - 1);
      switch(index) {
        case 1:
          setTitreExp2('');
          setDesExp2('');
          break;
        case 2:
          setTitreExp3('');
          setDesExp3('');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="grid gap-6">
      {/* Expérience 1 */}
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Expérience 1</h3>
        <div>
          <label htmlFor="experience-title-1" className="block text-sm font-medium text-gray-700">
            Titre du poste
          </label>
          <input
            type="text"
            id="experience-title-1"
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            placeholder="Titre du poste"
            value={titreexp1}
            onChange={(e) => setTitreExp1(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="experience-description-1" className="block text-sm font-medium text-gray-700">
            Description des missions
          </label>
          <textarea
            id="experience-description-1"
            className="flex min-h-[80px] w-full rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            rows="4"
            placeholder="Description des missions"
            value={desexp1}
            onChange={(e) => setDesExp1(e.target.value)}
            required
          ></textarea>
        </div>
      </div>

      {/* Expérience 2 */}
      {visibleExperiences > 1 && (
        <div className="grid gap-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Expérience 2</h3>
            <button
              type="button"
              onClick={() => handleRemoveExperience(1)}
              className="text-red-500"
            >
              Retirer
            </button>
          </div>
          <div>
            <label htmlFor="experience-title-2" className="block text-sm font-medium text-gray-700">
              Titre du poste
            </label>
            <input
              type="text"
              id="experience-title-2"
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              placeholder="Titre du poste"
              value={titreexp2}
              onChange={(e) => setTitreExp2(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="experience-description-2" className="block text-sm font-medium text-gray-700">
              Description des missions
            </label>
            <textarea
              id="experience-description-2"
              className="flex min-h-[80px] w-full rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              rows="4"
              placeholder="Description des missions"
              value={desexp2}
              onChange={(e) => setDesExp2(e.target.value)}
              required
            ></textarea>
          </div>
        </div>
      )}

      {/* Expérience 3 */}
      {visibleExperiences > 2 && (
        <div className="grid gap-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Expérience 3</h3>
            <button
              type="button"
              onClick={() => handleRemoveExperience(2)}
              className="text-red-500"
            >
              Retirer
            </button>
          </div>
          <div>
            <label htmlFor="experience-title-3" className="block text-sm font-medium text-gray-700">
              Titre du poste
            </label>
            <input
              type="text"
              id="experience-title-3"
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              placeholder="Titre du poste"
              value={titreexp3}
              onChange={(e) => setTitreExp3(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="experience-description-3" className="block text-sm font-medium text-gray-700">
              Description des missions
            </label>
            <textarea
              id="experience-description-3"
              className="flex min-h-[80px] w-full rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              rows="4"
              placeholder="Description des missions"
              value={desexp3}
              onChange={(e) => setDesExp3(e.target.value)}
              required
            ></textarea>
          </div>
        </div>
      )}

      {visibleExperiences < 3 && (
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