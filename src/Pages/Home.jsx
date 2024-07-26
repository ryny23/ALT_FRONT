import React from 'react'
import Hero1 from '../Components/Hero1'
import CTA from '../Components/CTA'
import Temoignages1 from '../Components/Temoignages1'
import Features2 from '../Components/Features2'
import Nav from '../Components/Nav'
import Newsletter from '../Components/Newsletter'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import Benefices from '../Components/Benefices'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import Hr2 from '../Components/Hr2'
import CtaInscription from '../Components/CtaInscription'
import TextGenerateEffect from '../Components/TextGenerateEffect'


  const text = `ALT est la première plateforme d'intelligence juridique dédiée aux professionnels du droit au Cameroun. Grâce à des technologies de pointe, nous centralisons et analysons en profondeur l'ensemble des textes législatifs, jurisprudences et réglementations pour vous fournir des informations juridiques toujours à jour et exploitables. Notre mission : vous permettre de gagner un temps précieux et un avantage concurrentiel décisif.`;
// const features = [
// {
// name: "Veille réglementaire publique : Suivez en temps réel les évolutions législatives et réglementaires",
// description:
// "Grâce à notre système de veille personnalisé, vous êtes instantanément alerté des nouveaux textes de loi, décrets, arrêtés ou circulaires publiés dans vos domaines de compétence. Anticipez les changements et adaptez vos procédures en amont.",
// icon: CloudArrowUpIcon,
// },
// {
// name: "Analyse d'impact réglementaire publique : Évaluez précisément les conséquences juridiques et opérationnelles",
// description: "Nos algorithmes d'analyse sémantique décortiquent pour vous la complexité des textes législatifs et réglementaires. Vous bénéficiez ainsi d'une vision claire et exploitable de leurs implications concrètes sur le fonctionnement de votre administration.",
// icon: LockClosedIcon,
// },
// {
// name: "Bibliothèque juridique publique : Accédez à l'intégralité du droit public camerounais",
// description: "Lois, codes, décrets, jurisprudences... Retrouvez en un clic tous les textes juridiques encadrant l'action publique au Cameroun dans notre bibliothèque juridique publique centralisée et constamment mise à jour.",
// icon: ServerIcon,
// },
// ]


function Home() {
  return (
    <div className=' scroll-smooth'>
      <div>
        <Nav/>
      </div>

      <div>
        <Hero1/>

        <div>
            <div class=" scroll-smooth px-2 mx-auto max-w-screen-xl text-center lg:px-4">
                <div class="mx-auto max-w-screen-sm">
                    <h2 class=" mb-6 text-5xl tracking-tight font-extrabold text-green-500 dark:text-white">Qu'est-ce que ALT ?</h2>
                    <h3 class="pb-[15px] font-light text-gray-500 sm:text-xl dark:text-gray-400"></h3>
                    <p className='pb-[45px] sm:text-xl'>
                      <TextGenerateEffect words={text} />
                    </p>
                </div>
            </div>
        </div>


        <Features2/>
            {/* <div>
            <section class="mt-20 bg-white dark:bg-gray-900">
            <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <img class="w-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg" alt="dashboard image"/>
                <img class="w-full hidden dark:block" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg" alt="dashboard image"/>
                <div class="mt-4 md:mt-0">
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                        {features.map((feature) => (
                          <div key={feature.name} className="relative pl-9">
                          <dt className="inline font-semibold text-gray-900">
                          <feature.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                          {feature.name}
                          </dt>{' '}
                          <dd className="inline">{feature.description}</dd>
                          </div>
                        ))}
                        </dl>
                        </div>
                        </div>
                        </section>
                      </div> */}
        <CTA/>
        <Benefices/>
        <Temoignages1/>
        <ContactUs/>
        <CtaInscription/>
        <Newsletter/>
      </div>
      <Footer/>
    </div>
    
  )
}

export default Home