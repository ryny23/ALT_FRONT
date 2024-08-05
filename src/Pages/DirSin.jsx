import React from 'react'
import Nav from '../Components/Nav'
import CTA3 from '../Components/CTA3'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import p1 from '../assets/1.png'
import p2 from '../assets/2.png'
import Footer from '../Components/Footer'


const features = [
  {
    name: 'Veille jurisprudentielle: Suivez les dernières décisions de justice impactant vos activités',
    description:
    "Définissez vos préférences pour recevoir des alertes personnalisées à chaque nouvelle jurisprudence rendue dans les domaines du droit des assurances, de la responsabilité civile, etc. Anticipez les évolutions et adaptez vos processus.",
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Analyse juridique assistée par IA : Renforcez la qualité juridique de vos dossiers',
    description: "Faites analyser vos conventions, rapports d'expertise ou autres pièces par notre moteur d'analyse sémantique. Celui-ci vous permettra d'identifier les risques juridiques potentiels et vous fournira des recommandations pour sécuriser vos procédures",
    icon: LockClosedIcon,
  },
  {
    name: 'Gestion documentaire juridique: Centralisez et partagez vos ressources juridiques en interne.',
    description: "Constituez votre propre bibliothèque de modèles, conventions, jurisprudences annotées sur ALT. Vous pourrez ensuite facilement partager ces documents avec vos équipes pour harmoniser vos pratiques",
    icon: ServerIcon,
  },
]

const DirSin = () => {
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
              src={p2}
              alt=""
            />
          </div>
          <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
            <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
              <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-green-500 uppercase rounded-full bg-teal-accent-400">
              Directions sinistres
              </p>
              <h2 className="mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
              La solution juridique
                <br className="hidden md:block" />
                sur-mesure pour les{' '}
                <span className="inline-block text-deep-purple-accent-400">
                directions sinistres
                </span>
              </h2>
              <p className="pr-5 mb-5 text-base text-gray-700 md:text-lg">
              En tant que direction sinistres au sein d'une compagnie d'assurance, 
              vous devez faire face à de nombreux défis juridiques complexes au quotidien. 
              Avec ALT, vous bénéficiez d'outils intelligents spécialement conçus pour vous 
              aider à gérer efficacement vos dossiers d'indemnisation dans le strict respect 
              de la réglementation.
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
        <img class="w-full rounded-full" src={p1} alt="dashboard image"/>
        <img class="w-full hidden dark:block" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg" alt="dashboard image"/>
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
              <p class="text-2xl font-medium text-gray-900 dark:text-white">"Grâce aux outils d'ALT, nous avons pu revoir en profondeur nos processus de gestion des sinistres pour les rendre pleinement conformes aux dernières jurisprudences, tout en gagnant considérablement en productivité."</p>
          </blockquote>
          <figcaption class="flex items-center justify-center mt-6 space-x-3">
              <img class="w-6 h-6 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" alt="profile picture"/>
              <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                  <div class="pr-3 font-medium text-gray-900 dark:text-white">M. Ngako</div>
                  <div class="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">Responsable juridique sinistres chez CamAssur</div>
              </div>
          </figcaption>
      </figure>
  </div>
</section>
      </div>

    <CTA3/>
    </div>
  )
}

export default DirSin