import React from 'react';
import { motion } from 'framer-motion';

const text = "ALT est la première plateforme d'intelligence juridique dédiée aux professionnels du droit au Cameroun. Grâce à des technologies de pointe, nous centralisons et analysons en profondeur l'ensemble des textes législatifs, jurisprudences et réglementations pour vous fournir des informations juridiques toujours à jour et exploitables. Notre mission : vous permettre de gagner un temps précieux et un avantage concurrentiel décisif.";

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

const TextReveal = () => {
  return (
    <div className="scroll-smooth px-2 mx-auto max-w-screen-xl text-center lg:px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-screen-sm"
      >
        {text.split(" ").map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={textVariants}
            className="pb-[45px] sm:text-xl"
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default TextReveal;
