import React, { useEffect } from 'react';
import { motion, stagger, useAnimate, useInView } from 'framer-motion'; // Import des modules nécessaires de Framer Motion
// import backgroundImage from '../assets/ban1.webp'


// Composant TypewriterEffect pour l'effet de machine à écrire
const TypewriterEffect = ({
  words,            // Liste des mots à afficher
  className,        // Classes CSS personnalisées pour le conteneur
  cursorClassName,  // Classes CSS personnalisées pour le curseur clignotant
}) => {
  // Transformation des mots en tableaux de caractères
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(''),
  }));

  const [scope, animate] = useAnimate(); // Utilisation des hooks de Framer Motion
  const isInView = useInView(scope);     // Détection si l'élément est dans la vue

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView, animate]);

  // Fonction pour rendre les mots avec animation
  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <motion.span
                initial={{}}
                key={`char-${index}`}
                className={`dark:text-white text-black opacity-0 hidden ${word.className}`}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={`text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center ${className}`}>
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={`inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-green-500 ${cursorClassName}`}
      ></motion.span>
    </div>
  );
};

// Composant TypewriterEffectSmooth pour un effet de machine à écrire lisse
const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(''),
  }));

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <span
                key={`char-${index}`}
                className={`dark:text-white text-black ${word.className}`}
              >
                {char}
              </span>
            ))}
            &nbsp;
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex space-x-1 my-6 ${className}`}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{ width: '0%' }}
        whileInView={{ width: 'fit-content' }}
        transition={{ duration: 2, ease: 'linear', delay: 1 }}
      >
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{ whiteSpace: 'nowrap' }}
        >
          {renderWords()} 
        </div> 
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={`block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-green-500 ${cursorClassName}`}
      ></motion.span>
    </div>
  );
};

// Démo du composant TypewriterEffectSmooth
const TypewriterEffectSmoothDemo = () => {
  const words = [
    { text: 'Le droit' },
    { text: 'à' },
    { text: 'portée' },
    { text: 'de' },
    { text: 'clic.', className: 'text-green-500 dark:text-green-500' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        Centralisez, analysez et maîtrisez l'ensemble du droit camerounais
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
          Signup
        </button>
      </div>
    </div>
  );
};

// Composant principal de l'application
export default function App() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      // style={{ backgroundImage: `url(${backgroundImage})` }} // Uncomment and set your background image here
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white opacity-35"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <TypewriterEffectSmoothDemo />
      </div>
    </div>
  );
}
