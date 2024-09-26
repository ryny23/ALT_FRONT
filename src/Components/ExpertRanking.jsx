import React from 'react';
import { Link } from 'react-router-dom';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateAvatar = (name, backgroundColor) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill={backgroundColor} />
      <text x="20" y="25" fontFamily="Arial" fontSize="16" fill="white" textAnchor="middle">{initials}</text>
    </svg>
  );
};

const ExpertPodium = ({ experts }) => {
  const podiumOrder = [1, 0, 2];
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div className="flex justify-center items-end mb-8">
      {podiumOrder.map((index, i) => {
        const expert = experts[index];
        const podiumHeight = i === 0 ? 'h-32' : i === 1 ? 'h-24' : 'h-16';
        
        return (
          <div key={expert.id} className={`flex flex-col items-center mx-2`}>
            <div className="mb-2">
              {generateAvatar(`${expert.acf.prenom} ${expert.acf.nom}`, colors[i])}
            </div>
            <div className="text-center">
              <p className="font-semibold">Me. {expert.acf.nom} {expert.acf.prenom}</p>
              <div className="text-yellow-400">{'★'.repeat(3 - i)}</div>
            </div>
            <div className={`w-20 ${podiumHeight} ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-300' : 'bg-yellow-700'} mt-2`}></div>
          </div>
        );
      })}
    </div>
  );
};

const ExpertRanking = ({ experts }) => {
  const podiumExperts = shuffleArray([...experts]).slice(0, 3);
  const remainingExperts = experts.filter(expert => !podiumExperts.includes(expert));
  const mentionSpecialExperts = shuffleArray(remainingExperts).slice(0, 2);

  return (
    <div>
      <ExpertPodium experts={podiumExperts} />
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Mentions spéciales :</h4>
        <ul className="list-disc list-inside">
          {mentionSpecialExperts.map((expert, index) => (
            <li key={expert.id}>
              {index + 4}. Me. {expert.acf.nom} {expert.acf.prenom} <span className="text-yellow-400">{'★'}</span>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/dashboard/expert" className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
        Voir tous les experts
      </Link>
    </div>
  );
};

export default ExpertRanking;