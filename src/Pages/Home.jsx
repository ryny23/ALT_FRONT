import React, { useState, useEffect } from 'react';
import Hero1 from '../Components/Hero1';
import CTA from '../Components/CTA';
import Temoignages1 from '../Components/Temoignages1';
import Features2 from '../Components/Features2';
import Nav from '../Components/Nav';
import Newsletter from '../Components/Newsletter';
import Benefices from '../Components/Benefices';
import ContactUs from '../Components/ContactUs';
import Footer from '../Components/Footer';
import CtaInscription from '../Components/CtaInscription';
import TextGenerateEffect from '../Components/TextGenerateEffect';
import anime from '../assets/anime.svg';


const text = `ALT est la première plateforme d'intelligence juridique dédiée aux professionnels du droit au Cameroun. Grâce à des technologies de pointe, nous centralisons et analysons en profondeur l'ensemble des textes législatifs, jurisprudences et réglementations pour vous fournir des informations juridiques toujours à jour et exploitables. Notre mission : vous permettre de gagner un temps précieux et un avantage concurrentiel décisif.`;

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className='scroll-smooth'>
      <div>
      </div>

      <div>
        <Hero1 />

        <div>
          <div className="scroll-smooth px-2 mx-auto max-w-screen-xl text-center lg:px-4">
            <div className="mx-auto max-w-screen-sm">
              <h2 className="mb-6 text-5xl tracking-tight font-extrabold text-green-500">Qu'est-ce que ALT ?</h2>
              <h3 className="pb-[15px] font-light text-gray-500 sm:text-xl dark:text-gray-400"></h3>
              <p className='pb-[45px] sm:text-xl'>
                <TextGenerateEffect words={text} />
              </p>
            </div>
          </div>
        </div>

        <Features2 />
        <CTA />
        <Benefices />
        <Temoignages1 />
        <ContactUs />
        <CtaInscription />
        <Newsletter />
      </div>
    </div>
  );
}

export default Home;
