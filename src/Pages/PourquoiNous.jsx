import React from 'react'
import Nav from '../Components/Nav'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import walp1 from './../assets/walp1.png'
import CTA1 from'../Components/CTA1'
import Footer from '../Components/Footer'


const PourquoiNous = () => {
  return (
    <div>
          <div>
          </div>

          <div>
            <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 500h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-green-500">Pourquoi Nous ?</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Pourquoi choisir ALT pour votre pratique juridique ?</h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
              Chez ALT, nous avons à cœur de révolutionner l'accès au droit et d'offrir aux professionnels juridiques camerounais 
              les meilleurs outils pour gagner en productivité et en compétitivité. Découvrez les nombreuses raisons qui font d'ALT 
              le partenaire idéal pour booster votre activité. 
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            src={walp1}
            alt=""
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">

            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900"><p className="text-base font-semibold leading-7 text-green-500">Une vision d'avenir pour la profession</p>Adoptez les technologies juridiques de demain </h2>
              <p className="mt-6">
              Chez ALT, nous croyons fermement que l'intelligence artificielle et les nouvelles technologies vont profondément transformer la pratique du droit dans les années à venir. En choisissant notre plateforme dès aujourd'hui, vous vous donnez les moyens d'anticiper ces changements et de rester à la pointe de votre secteur. Nos solutions innovantes vous permettent de gagner un avantage concurrentiel décisif
              </p>


              {/* <ul role="list" className="mt-8 space-y-8 text-gray-500">
                <li className="flex gap-x-3">
                  <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-green-500" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-gray-900">Push to deploy.</strong> Lorem ipsum, dolor sit amet
                    consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate
                    blanditiis ratione.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-green-500" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-gray-900">SSL certificates.</strong> Anim aute id magna aliqua
                    ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <ServerIcon className="mt-1 h-5 w-5 flex-none text-green-500" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold text-gray-900">Database backups.</strong> Ac tincidunt sapien
                    vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.
                  </span>
                </li>
              </ul> */}
              
              
              
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900"><p className="text-base font-semibold leading-7 text-green-500">Une équipe d'experts dédiés</p>Bénéficiez de l'expertise d'une équipe passionnée</h2>
              <p className="mt-6">
              ALT a été conçue comme une plateforme modulaire et évolutive, capable de s'adapter aux changements dans votre pratique. Au fil du temps, nous enrichirons continuellement nos fonctionnalités pour répondre à vos nouveaux défis. Choisir ALT, c'est opter pour un partenaire de long terme à même d'accompagner la croissance de votre activité.Derrière ALT se cache une équipe de juristes, d'ingénieurs et d'experts en intelligence artificielle entièrement dévoués à la conception d'outils juridiques toujours plus performants. En choisissant notre plateforme, vous profitez de leur savoir-faire de pointe et de leur engagement à vous offrir un service d'exception au quotidien.</p>

              
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900"><p className="text-base font-semibold leading-7 text-green-500">Pourquoi Nous ?</p>Une plateforme évolutive</h2>
              <p className="mt-6">
              ALT a été conçue comme une plateforme modulaire et évolutive, capable de s'adapter aux changements dans votre pratique. Au fil du temps, nous enrichirons continuellement nos fonctionnalités pour répondre à vos nouveaux défis. Choisir ALT, c'est opter pour un partenaire de long terme à même d'accompagner la croissance de votre activité.
              </p>

              
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900"><p className="text-base font-semibold leading-7 text-green-500">Pourquoi Nous ?</p>Notre priorité : votre entière satisfaction</h2>
              <p className="mt-6">
              Nous plaçons la qualité de service et la satisfaction client au cœur de nos priorités. En choisissant notre plateforme, vous bénéficiez d'un support dédié, d'une hotline disponible en permanence et d'un engagement ferme à toujours vous offrir une expérience utilisateur optimale. Votre réussite est notre principale motivation. 
              </p>
              
              </div>
          </div>
        </div>
      </div>
            </div>
          </div>

          <div>
            <CTA1/>
          </div>
    </div>
  )
}

export default PourquoiNous