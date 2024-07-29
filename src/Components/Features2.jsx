import p1 from '../assets/1.png'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Bibliothèque juridique centralisée',
    description:
      "Avec ALT, vous avez accès à une bibliothèque juridique complète et constamment mise à jour, rassemblant l'ensemble des lois, codes, jurisprudences et réglementations en vigueur au Cameroun. Plus besoin de perdre un temps précieux à rechercher les textes dont vous avez besoin - ils sont tous centralisés et accessibles en quelques clics.",
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Veille juridique personnalisée',
    description: "Restez informé en temps réel des dernières évolutions législatives impactant vos domaines de pratique grâce à notre système d'alertes personnalisées. Définissez vos préférences et recevez des notifications dès qu'un nouveau texte de loi entre en vigueur ou qu'une jurisprudence est rendue dans vos spécialités.",
    icon: LockClosedIcon,
  },
  {
    name: 'Recherche sémantique avancée:',
    description: "Notre moteur de recherche juridique dernier cri vous permet de trouver instantanément les informations dont vous avez besoin grâce à des requêtes en langage naturel. Plus besoin de formuler des recherches complexes - entrez simplement votre question et ALT vous fournira les résultats les plus pertinents.",
    icon: ServerIcon,
  },
]

export default function Features2() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-green-600">Fonctionnalités</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Des outils juridiques puissants pour booster votre productivité</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-red-600" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            src={p1}
            alt="Product screenshot"
            className="rounded-full w-[24rem] max-w-none shadow-xl ring-1 ring-gray-400/10 sm:w-[720px] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  )
}
