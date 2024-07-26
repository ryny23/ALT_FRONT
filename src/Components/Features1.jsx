import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Bibliothèque juridique centralisée',
    description:
      "Fini les recherches fastidieuses à travers de multiples sources disparates pour rassembler les textes juridiques dont vous avez besoin. Avec ALT, vous bénéficiez d'un accès centralisé à une bibliothèque juridique exhaustive, soigneusement organisée et constamment tenue à jour. Notre bibliothèque rassemble l'intégralité des codes et lois en vigueur au Cameroun, mais également les décrets, arrêtés, circulaires ainsi que les jurisprudences rendues par les plus hautes cours du pays. Tous ces contenus sont directement issus des sources officielles pour vous garantir un accès aux textes juridiques de référence. De plus, cette bibliothèque est mise à jour en temps réel. Dès qu'un nouveau texte de loi ou une décision de justice est publiée, elle est immédiatement intégrée à notre base de données pour vous assurer une parfaite conformité. Les textes sont disponibles dans divers formats numériques pour s'adapter à vos usages : PDF, ePub, HTML, etc. Vous pouvez également les annoter, les commenter, créer des signets pour les retrouver facilement. Notre bibliothèque juridique centralisée est l'outil idéal pour accéder à un réservoir complet et fiable de ressources juridiques, sans avoir à vous disperser ni à perdre un temps précieux dans des recherches laborieuses.",
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Veille juridique personnalisée',
    description:
      "Dans un environnement juridique en constante évolution, il est crucial de suivre au plus près les nouveaux textes de loi, jurisprudences et réglementations impactant vos domaines d'activité. C'est pourquoi ALT vous propose un système d'alertes juridiques entièrement personnalisable. Définissez avec précision vos préférences de veille en quelques clics seulement. Sélectionnez les domaines du droit qui vous intéressent (droit des affaires, droit social, droit pénal, etc.), les types de textes à suivre (lois, décrets, jurisprudences, etc.) ainsi que leur provenance (nationale, régionale, jurisprudence des cours supérieures, etc.) Vous recevrez alors des notifications en temps réel dès qu'un nouveau texte correspondant à vos critères est publié. Chaque alerte comprend un bref résumé du texte, ses points clés et un lien pour l'explorer dans notre bibliothèque juridique. Grâce à ce système sur-mesure, vous n'aurez plus à perdre un temps précieux à éplucher les multiples sources d'information juridique. Restez concentré sur l'essentiel, ALT se charge de vous tenir informé de ce qui compte réellement pour votre pratique. De plus, vous pourrez à tout moment ajuster vos préférences d'alertes pour les faire évoluer au gré des besoins de votre activité. Une veille juridique intelligente et flexible, parfaitement alignée sur vos priorités ",
    icon: LockClosedIcon,
  },
  {
    name: 'Recherche sémantique avancée',
    description:
      "Faire des recherches pertinentes dans une vaste base de données juridique peut vite s'avérer complexe avec les moteurs de recherche traditionnels. C'est pourquoi ALT intègre un moteur de recherche sémantique dernier cri, capable de comprendre le langage naturel et le contexte de vos requête Plus besoin de formuler des équations de recherche complexes avec des mots-clés et des opérateurs booléens. Interrogez simplement ALT comme vous le feriez avec un assistant vocal, en posant votre question de manière naturelle. Grâce à des algorithmes d'intelligence artificielle, notre moteur analyse en profondeur le sens de votre requête et vous fournit les résultats les plus pertinents issus de notre bibliothèque juridique. Les textes de loi, jurisprudences et autres documents connexes sont remontés de manière intelligente et priorisée. De plus, ALT vous suggère automatiquement des pistes de recherche complémentaires en lien avec votre requête initiale pour approfondir vos investigations si nécessaire. Vous pouvez également effectuer des recherches en contexte en important vos propres documents dans la plateforme. Cette recherche juridique intuitive et ultra-performante vous fait gagner un temps précieux. Fini les tâtonnements et les allers-retours pour trouver l'information dont vous avez besoin !",
    icon: ArrowPathIcon,
  },
  {
    name: 'Page experts (avocats, notaires)',
    description:
      "Sur la plateforme ALT, vous avez un accès direct à un annuaire complet d'experts juridiques, comprenant avocats, notaires et autres professionnels du droit. Chaque profil d'expert présente en détail leurs qualifications, expériences, spécialités et avis des clients, vous permettant de choisir le professionnel le mieux adapté à vos besoins. En plus de consulter les profils, vous pouvez également vérifier la disponibilité des experts et prendre rendez-vous en ligne pour des consultations juridiques, que ce soit à distance ou en personne. Cette fonctionnalité garantit que vous recevez des conseils précis et personnalisés, exactement quand vous en avez besoin, vous assurant ainsi un accompagnement juridique de qualité en toute confiance. ",
    icon: FingerPrintIcon,
  },
  {
    name: 'Modèles de documents à télécharger',
    description:
      "Nous mettons à votre disposition une vaste bibliothèque de modèles de documents juridiques téléchargeables : que vous ayez besoin de contrats, de baux, de lettres officielles ou d'autres types de documents, vous trouverez des modèles conformes aux exigences légales et prêts à être utilisés. Vous pouvez télécharger ces documents en différents formats, tels que PDF et Word, pour une utilisation immédiate. Cette fonctionnalité vous aide à gagner du temps et à garantir que vos documents sont juridiquement solides et bien préparés. ",
    icon: FingerPrintIcon,
  },
]

export default function Features1() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Découvrez toutes les fonctionnalités de ALT
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
          ALT est bien plus qu'une simple base de données juridique. Notre plateforme met à votre disposition un ensemble d'outils intelligents et intuitifs pour optimiser votre pratique du droit au quotidien. Explorez dès à présent toutes les fonctionnalités qui feront de ALT votre partenaire juridique indispensable
          </p>
        </div>

        
        <div className="mx-auto mt-[64px] max-w-[672px] sm:mt-[40px] lg:mt-[96px] lg:max-w-[896px]">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-1 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
