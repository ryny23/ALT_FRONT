import React from 'react';

const Astuces = ({ page }) => {
  const tips = {
    decisions: [
      {
        text: 'Combinez mots-clés, dates et juridiction',
        link: {
          text: 'TGI 18 avril 2019 "mentions légales"',
          href: '#'
        }
      },
      {
        text: 'Pour exclure un mot ou une phrase, utilisez SAUF',
        link: {
          text: 'contrat liste alternatives SAUF "liste électorale"',
          href: '#'
        }
      }
    ],
    legislations: [
      {
        text: 'Utilisez les références légales pour affiner votre recherche',
        link: {
          text: 'Loi n° 2021-1109',
          href: '#'
        }
      },
      {
        text: 'Consultez les amendements pour plus de détails',
        link: {
          text: 'Amendement n°452',
          href: '#'
        }
      }
    ],
    commentaires: [
      {
        text: 'Filtrez les commentaires par date pour les plus récents',
        link: {
          text: 'Commentaires récents',
          href: '#'
        }
      },
      {
        text: 'Utilisez des mots-clés spécifiques pour des résultats pertinents',
        link: {
          text: 'Mots-clés spécifiques',
          href: '#'
        }
      }
    ],
    // Ajoute d'autres sections ici si nécessaire
  };

  return (
    <div className="flex items-center justify-start my-4">
      <div className="max-w-2xl w-full p-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4 capitalize">{page}</h1>
        <div className="p-4 bg-blue-50 rounded-md">
          <div className="flex items-center mb-2">
            <img alt="info-icon" src="https://openui.fly.dev/openui/24x24.svg?text=ℹ️" className="mr-2" />
            <span className="font-semibold">Astuces</span>
          </div>
          {tips[page]?.map((tip, index) => (
            <p key={index} className="text-sm text-zinc-700 mb-2">
              {tip.text} (<a href={tip.link.href} className="text-blue-600 underline">{tip.link.text}</a>)
            </p>
          )) || <p className="text-sm text-zinc-700">Aucune astuce disponible pour cette section.</p>}
        </div>
      </div>
    </div>
  );
};

export default Astuces;