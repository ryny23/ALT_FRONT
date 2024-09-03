import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LegalTextManager = () => {
  const [step, setStep] = useState(1);
  const [action, setAction] = useState('');
  const [textType, setTextType] = useState('');
  const [linkedTypes, setLinkedTypes] = useState({});
  const [structure, setStructure] = useState([]);
  const [content, setContent] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const elements = ['Section', 'Chapitre', 'Titre'];

  const baseUrl = 'https://alt.back.qilinsa.com';

const createPost = async (data, type) => {
  const endpoint = `/wp-json/wp/v2/${type}`;
  const response = await fetch(baseUrl + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const importCsv = async (csvFile) => {
  const formData = new FormData();
  formData.append('file', csvFile);

  const response = await fetch(`${baseUrl}/wp-json/wp/v2/import`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
};


  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(structure);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStructure(items);
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (action === 'import' && csvFile) {
      const result = await importCsv(csvFile);
      console.log(result);
    } else if (action === 'create') {
      const data = { content, structure, linkedTypes };
      const result = await createPost(data, textType);
      console.log(result);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {step === 1 && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Choisissez une action</h2>
          <button className="btn" onClick={() => { setAction('import'); setStep(2); }}>Importer</button>
          <button className="btn" onClick={() => { setAction('create'); setStep(2); }}>Créer</button>
          <button className="btn" onClick={() => { setAction('export'); setStep(2); }}>Exporter</button>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Sélectionnez un type de texte juridique</h2>
          <select
            className="select"
            value={textType}
            onChange={(e) => { setTextType(e.target.value); setStep(3); }}
          >
            <option value="">Sélectionner...</option>
            <option value="legislations">Legislations</option>
            <option value="commentaires">Commentaires</option>
            <option value="articles">Articles</option>
            <option value="decisions">Décisions</option>
          </select>

          {textType && (
            <div>
              <h3>Associer à d'autres types :</h3>
              {['legislations', 'commentaires', 'articles', 'decisions'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={type}
                    onChange={(e) => setLinkedTypes((prev) => ({
                      ...prev,
                      [e.target.value]: e.target.checked
                    }))}
                  />
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      {step === 3 && action === 'create' && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Réajustez la structure du contenu</h2>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="structure">
              {(provided) => (
                <ul className="space-y-2" {...provided.droppableProps} ref={provided.innerRef}>
                  {structure.map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
                      {(provided) => (
                        <li
                          className="bg-gray-200 p-2 rounded"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          {item}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          <div>
            <h3>Ajouter des éléments :</h3>
            {elements.map((el) => (
              <button
                key={el}
                className="btn m-1"
                onClick={() => setStructure([...structure, el])}
              >
                {el}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && action === 'import' && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Importer un fichier CSV</h2>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
      )}
      {step === 4 && action === 'create' && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Créer un texte manuellement</h2>
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            cols="50"
            placeholder="Écrivez votre texte ici..."
          />
        </div>
      )}
      {step === 5 && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Prévisualisation du texte</h2>
          <div className="bg-gray-100 p-4 rounded">
            {action === 'create' ? content : 'Prévisualisation indisponible pour l’importation'}
          </div>
        </div>
      )}
      {step === 6 && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Confirmation</h2>
          <button className="btn" onClick={handleSubmit}>Confirmer et Soumettre</button>
        </div>
      )}
      <div className="mt-4 flex space-x-4">
        {step > 1 && <button className="btn" onClick={() => setStep(step - 1)}>Retour</button>}
        {step < 6 && <button className="btn" onClick={() => setStep(step + 1)}>Suivant</button>}
      </div>
    </div>
  );
};

export default LegalTextManager;
