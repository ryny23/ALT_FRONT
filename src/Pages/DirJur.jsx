import React from 'react'
import Nav from '../Components/Nav'
import CTA3 from '../Components/CTA3'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import citation from '../assets/Citation.png'
import about from '../assets/about.png'
import Footer from '../Components/Footer'


const features = [
  {
    name: "Veille réglementaire publique : Suivez en temps réel les évolutions législatives et réglementaires",
    description:
    "Grâce à notre système de veille personnalisé, vous êtes instantanément alerté des nouveaux textes de loi, décrets, arrêtés ou circulaires publiés dans vos domaines de compétence. Anticipez les changements et adaptez vos procédures en amont.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Analyse d'impact réglementaire publique : Évaluez précisément les conséquences juridiques et opérationnelles",
    description: "Nos algorithmes d'analyse sémantique décortiquent pour vous la complexité des textes législatifs et réglementaires. Vous bénéficiez ainsi d'une vision claire et exploitable de leurs implications concrètes sur le fonctionnement de votre administration.",
    icon: LockClosedIcon,
  },
  {
    name: "Bibliothèque juridique publique : Accédez à l'intégralité du droit public camerounais",
    description: "Lois, codes, décrets, jurisprudences... Retrouvez en un clic tous les textes juridiques encadrant l'action publique au Cameroun dans notre bibliothèque juridique publique centralisée et constamment mise à jour.",
    icon: ServerIcon,
  },
]

const DirJur = () => {
  return (
    <div>

      <div>
      </div>
      
      
      <div>
        <div>
        <div className="relative flex flex-col-reverse py-16 lg:pt-0 lg:flex-col lg:pb-0">
          <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
            <svg
              className="absolute left-0 hidden h-full text-white transform -translate-x-1/2 lg:block"
              viewBox="0 0 100 100"
              fill="currentColor"
              preserveAspectRatio="none slice"
            >
              <path d="M50 0H100L50 100H0L50 0Z" />
            </svg>
            <img
              className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none md:h-96 lg:h-full"
              src={citation}
              alt=""
            />
          </div>
          <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
            <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
              <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-green-500 uppercase rounded-full bg-teal-accent-400">
              Directions juridiques du secteur public
              </p>
              <h2 className="mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
              La plateforme juridique 
                <br className="hidden md:block" />
                de référence pour le secteur public{' '}
                <span className="inline-block text-deep-purple-accent-400">
                
                </span>
              </h2>
              <p className="pr-5 mb-5 text-base text-gray-700 md:text-lg">
              En tant que direction juridique d'une administration ou d'un organisme public, vous avez pour mission de veiller à la stricte conformité de vos activités avec le droit et la réglementation en vigueur. ALT vous offre un environnement de travail complet et des outils sur-mesure pour relever ce défi avec la plus grande rigueur.
              </p>
              </div>
              </div>
              </div>
              </div>

              <div>
        <div className=" rounded-3xl px-10 mt-20 bg-white dark:bg-slate-900">
        <div className="rounded-3xl mx-auto will-change-scroll h-auto">
          <div className=" rounded-3xl relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl  sm:px-16 md:pt-10 flex gap-x-20">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 :left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
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


            <div className="mx-auto max-w-md flex-auto py-10 text-center">
              <h2 className="text-[60px] font-bold tracking-tight text-white sm:text-4xl">
              Vous etes prets ?
              </h2>
              <p className="mt-6 text-l leading-8 text-gray-300">
              Centralisez, analysez et maîtrisez l'ensemble du droit camerounais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>



              <section class="mt-20 bg-white dark:bg-gray-900">
    <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
        <img class="rounded-2xl w-full dark:hidden" src={about} alt="dashboard image"/>
        <img class="w-full hidden dark:block rounded-full" src={about} alt="dashboard image"/>
        <div class="mt-4 md:mt-0">
        <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-green-600" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
        </div>
    </div>
</section>
          
        <section class="mb-20 mt-4 bg-white dark:bg-gray-900">
  <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
      <figure class="max-w-screen-md mx-auto">
          <svg class="h-12 mx-auto mb-3 text-red-400 dark:text-red-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/>
          </svg> 
          <blockquote>
              <p class="text-2xl font-medium text-gray-900 dark:text-white">"ALT nous a permis de considérablement gagner en productivité et en réactivité dans le suivi des évolutions réglementaires impactant notre ministère."</p>
          </blockquote>
          <figcaption class="flex items-center justify-center mt-6 space-x-3">
              <img class="w-6 h-6 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" alt="profile picture"/>
              <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                  <div class="pr-3 font-medium text-gray-900 dark:text-white">M. Fouda</div>
                  <div class="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">Direction des affaires juridiques du Ministère de l'Économie</div>
              </div>
          </figcaption>
      </figure>
  </div>
</section>
      </div>

      <div>
        <div className="bg-white dark:bg-slate-900">
        <div className="mx-auto will-change-scroll h-auto">
          <div className="relative isolate overflow-hidden bg-black px-6 pt-4 shadow-2xl  sm:px-16 md:pt-4 flex gap-x-20">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 :left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
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


            <div className="mx-auto max-w-md flex-auto py-32 text-center">
              <p className="mt-6 text-l leading-8 text-gray-300">
              <div>
        <div className="bg-white dark:bg-slate-900">
        <div className="mx-auto will-change-scroll h-auto">
          <div className="border border-neutral-950 relative isolate overflow-hidden bg-black px-6 pt-4 shadow-2xl  sm:px-16 md:pt-4 flex gap-x-20">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 :left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
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


            <div className="mx-auto max-w-md flex-auto py-32 text-center">
              <h2 className="text-[60px] font-bold tracking-tight text-white sm:text-4xl">
              Convaincu ?
              </h2>
              <p className="mt-6 text-l leading-8 text-gray-300">
              Demandez un audit gratuit de conformité
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className=" bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Commencez
                </a>
                <a href="pourquoi-nous" className="text-sm font-semibold leading-6 text-white">
                  Lire plus <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    )
  }
  
  export default DirJur