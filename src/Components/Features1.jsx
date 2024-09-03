import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, LockClosedIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    name: "Bibliothèque juridique centralisée",
    shortDescription: "Accédez à une base de données complète et à jour des textes juridiques camerounais.",
    fullDescription: "Fini les recherches fastidieuses à travers de multiples sources disparates pour rassembler les textes juridiques dont vous avez besoin. Avec ALT, vous bénéficiez d'un accès centralisé à une bibliothèque juridique exhaustive, soigneusement organisée et constamment tenue à jour. Notre bibliothèque rassemble l'intégralité des codes et lois en vigueur au Cameroun, mais également les décrets, arrêtés, circulaires ainsi que les jurisprudences rendues par les plus hautes cours du pays.",
    icon: CloudArrowUpIcon,
    color: 'bg-blue-500',
  },
  {
    name: "Veille juridique personnalisée",
    shortDescription: "Recevez des alertes sur mesure pour rester informé des évolutions juridiques pertinentes.",
    fullDescription: "Dans un environnement juridique en constante évolution, il est crucial de suivre au plus près les nouveaux textes de loi, jurisprudences et réglementations impactant vos domaines d'activité. C'est pourquoi ALT vous propose un système d'alertes juridiques entièrement personnalisable. Définissez avec précision vos préférences de veille en quelques clics seulement. Sélectionnez les domaines du droit qui vous intéressent, les types de textes à suivre ainsi que leur provenance.",
    icon: LockClosedIcon,
    color: 'bg-green-500',
  },
  {
    name: "Recherche sémantique avancée",
    shortDescription: "Trouvez rapidement l'information juridique dont vous avez besoin grâce à l'IA.",
    fullDescription: "Faire des recherches pertinentes dans une vaste base de données juridique peut vite s'avérer complexe avec les moteurs de recherche traditionnels. C'est pourquoi ALT intègre un moteur de recherche sémantique dernier cri, capable de comprendre le langage naturel et le contexte de vos requêtes. Plus besoin de formuler des équations de recherche complexes avec des mots-clés et des opérateurs booléens. Interrogez simplement ALT comme vous le feriez avec un assistant vocal, en posant votre question de manière naturelle.",
    icon: MagnifyingGlassIcon,
    color: 'bg-purple-500',
  },
  {
    name: "Réseau d'experts juridiques",
    shortDescription: "Connectez-vous avec des avocats et notaires qualifiés pour des conseils personnalisés.",
    fullDescription: "Sur la plateforme ALT, vous avez un accès direct à un annuaire complet d'experts juridiques, comprenant avocats, notaires et autres professionnels du droit. Chaque profil d'expert présente en détail leurs qualifications, expériences, spécialités et avis des clients, vous permettant de choisir le professionnel le mieux adapté à vos besoins. En plus de consulter les profils, vous pouvez également vérifier la disponibilité des experts et prendre rendez-vous en ligne pour des consultations juridiques, que ce soit à distance ou en personne.",
    icon: UserGroupIcon,
    color: 'bg-red-500',
  },
];


const TypewriterEffect = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const index = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    index.current = 0;
  }, [text]);

  useEffect(() => {
    if (index.current < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index.current]);
        index.current += 1;
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      setShowCursor(false);
    }
  }, [text, displayedText, speed]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayedText}
      {showCursor && <span className="animate-blink">|</span>}
    </span>
  );
};

const FeatureCard = ({ feature, isActive, onClick }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      className={`cursor-pointer rounded-lg p-6 transition-all ${
        isActive ? feature.color : 'bg-gray-100'
      }`}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      layout
    >
      <Icon className={`h-8 w-8 ${isActive ? 'text-white' : 'text-gray-600'}`} />
      <h3 className={`mt-4 text-lg font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
        {feature.name}
      </h3>
      <p className={`mt-2 text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
        {feature.shortDescription}
      </p>
    </motion.div>
  );
};

const ModernFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  const handleFeatureClick = (index) => {
    if (!isAnimating && index !== activeFeature) {
      setIsAnimating(true);
      setActiveFeature(index);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const containerVariants = {
    center: { 
      x: "0%", 
      width: "100%",
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    left: { 
      x: "0%", 
      width: "50%",
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  return (
    <div ref={ref} className="bg-white py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-base font-semibold text-green-600">Optimisez votre pratique du droit</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Découvrez ALT : Votre assistant juridique intelligent
          </p>
          <p className="mt-6 text-lg text-gray-600">
            ALT révolutionne votre approche du droit avec des outils innovants et une expérience utilisateur inégalée.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <motion.div
            variants={containerVariants}
            initial="center"
            animate={activeFeature !== null ? "left" : "center"}
            className={`grid grid-cols-1 sm:grid-cols-2 gap-8 md:${activeFeature === null ? 'w-full' : 'w-1/2'} w-full`}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.name}
                feature={feature}
                isActive={activeFeature === index}
                onClick={() => handleFeatureClick(index)}
              />
            ))}
          </motion.div>

          <AnimatePresence>
            {activeFeature !== null && (
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: "0%" }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full md:w-1/2"
              >
                <div className="p-6 rounded-lg relative">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{features[activeFeature].name}</h3>
                  <div className="text-gray-700">
                    <TypewriterEffect text={features[activeFeature].fullDescription} />
                  </div>
                  <motion.button
                    className={`absolute top-2 right-2 px-3 py-1 text-sm text-white rounded-full shadow-md transition-colors duration-200 ${features[activeFeature].color}`}
                    onClick={() => setActiveFeature(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Masquer les détails
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ModernFeatures;