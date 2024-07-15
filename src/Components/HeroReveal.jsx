import React from 'react';
import { motion } from 'framer-motion';

const text = "Plongez dans l'inconnu, découvrez l'invisible. Votre aventure commence ici.";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut'
    },
  }),
};

const Hero = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.div
        initial="hidden"
        animate="visible"
        className="text-center text-white space-y-6"
      >
        {text.split(" ").map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={textVariants}
            className="text-4xl font-bold"
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default Hero;
