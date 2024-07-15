import ban1 from '../assets/ban1.webp'
import React from 'react';
import { motion } from 'framer-motion';

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
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-[24px] sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-green-600 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Le droit 
              <br />
              à portée de clic !
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
            <motion.div
        initial="hidden"
        animate="visible"
        className="text-left text-gray-300 space-y-6"
      >
        {text.split(" ").map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={textVariants}
            className="text-lg font-light"
          >
            {word}&nbsp;
          </motion.span>
        ))}
            </motion.div></p>
            
            
          </div>
          <div className="relative mt-[64px] h-[320px] lg:mt-[0px]">
            <img
              className="lg:absolute left-0 top-0 w-[57rem] max-w-none bg-white/5 ring-1 ring-white/10"
              src={ban1}
              alt="App screenshot"
              width={1824}
              height={1080}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
