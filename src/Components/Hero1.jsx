import React from 'react';
import { motion } from 'framer-motion';
import ban1 from '../assets/ban1.webp';

const text = "Centralisez, analysez et maîtrisez l'ensemble du droit camerounais";
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

export default function Hero1() {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
        <div className="relative isolate overflow-hidden rounded-3xl shadow-2xl">
          {/* Gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-green-500 via-teal-700 to-blue-600"
            style={{ mixBlendMode: 'multiply' }}
          ></div>

          {/* Content container */}
          <div className="relative flex flex-col lg:flex-row items-stretch">
            {/* Text content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
                  Le droit<br />à portée de clic !
                </h2>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="text-gray-100 space-y-2"
                >
                  {text.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={textVariants}
                      className="text-lg font-light inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Image container */}
            <div className="w-full lg:w-1/2">
              <img
                className="w-full h-full object-cover"
                src={ban1}
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}