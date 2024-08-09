import React from "react";
import { Typography } from "@material-tailwind/react";

const faqs = [
  {
    title: "Comment définir mes alertes de veille juridique ? / Est-il possible d'annoter les textes de loi ?",
    desc: "Liste des questions/réponses les plus courantes sur les fonctionnalités de la plateforme, la navigation, la recherche, les préférences utilisateur, etc.",
  },
  {
    title: "Quels sont les différents paliers d'abonnement / Puis-je résilier à tout moment ?",
    desc: "Questions/réponses relatives aux différentes formules d'abonnement, aux modalités de paiement, aux conditions d'utilisation, etc.",
  },
  {
    title: "Comment puis-je contacter le support technique ? / Existe-t-il des tutoriels vidéo ?",
    desc: "Questions/réponses sur les différents canaux de support disponibles, les délais de réponse, la documentation utilisateur, etc.",
  },
  {
    title: "Et si vous ne trouvez pas LA réponse ?",
    desc: "Formulaire de contact permettant aux utilisateurs de soumettre directement une nouvelle question à l'équipe d'assistance ALT.",
  }
];

export function Faqs4() {
  return (
    <section className="px-8 py-20">
      <div className="container mx-auto">
        <div className="mb-14 text-center ">
          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-4 text-4xl !leading-snug lg:text-[40px]"
          >
            F.A.Q
          </Typography>
          <Typography
            className="mx-auto font-normal text-[18px] !text-gray-500 lg:max-w-3xl"
          >
            Nous avons rassemblé dans cette FAQ les réponses aux interrogations les plus fréquemment rencontrées. Vous ne trouvez pas ce que vous cherchez ? N'hésitez pas à nous contacter directement !
          </Typography>
        </div>
        <div className="max-w-3xl mx-auto grid gap-10">
          {faqs.map(({ title, desc }) => (
            <div key={title}>
              <Typography color="blue-gray" className="pb-6 text-[20px] font-bold">
                {title}
              </Typography>
              <div className="border-t border-gray-200 pt-4">
                <Typography className="font-normal !text-gray-500">
                  {desc}
                </Typography>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-36 max-w-3xl mx-auto grid gap-10">
          <h2 className="text-2xl font-semibold mt-6 mb-3">
            Exemples Concrets de Problèmes Juridiques Résolus grâce à ALT
          </h2>

          <Typography color="blue-gray" className="pb-6 text-[20px] font-bold">
            1. Résolution d'un Litige Commercial
          </Typography>
        <Typography className="font-normal text-gray-500">
            <strong>Contexte :</strong> Une petite entreprise camerounaise avait
            un différend avec un fournisseur concernant des termes de livraison
            non respectés. Les retards fréquents dans les livraisons mettaient
            en péril leur production et leurs engagements envers leurs propres
            clients.
          </Typography>
        <Typography className="font-normal text-gray-500">
            <strong>Solution via ALT :</strong> L'entreprise a utilisé ALT pour
            consulter des lois commerciales et des précédents juridiques
            similaires. En accédant à des jurisprudences pertinentes, ils ont pu
            élaborer une argumentation solide pour négocier un accord à
            l'amiable avec le fournisseur. Grâce aux modèles de contrats
            disponibles sur ALT, ils ont également pu mettre à jour leurs futurs
            contrats pour inclure des clauses plus strictes concernant les
            délais de livraison.
          </Typography>

          <Typography color="blue-gray" className="pb-6 text-[20px] font-bold">
            2. Création d'une Start-up
          </Typography>
        <Typography className="font-normal text-gray-500">
            <strong>Contexte :</strong> Un groupe de jeunes entrepreneurs
            souhaitait créer une start-up technologique au Cameroun, mais ils ne
            savaient pas par où commencer pour s'assurer que leur entreprise
            soit conforme aux réglementations locales.
          </Typography>
        <Typography className="font-normal text-gray-500">
            <strong>Solution via ALT :</strong> Les entrepreneurs ont utilisé
            ALT pour accéder à une vaste base de données de lois sur la création
            d'entreprise, des décrets, et des régulations spécifiques au secteur
            technologique. Ils ont pu télécharger des modèles de documents
            juridiques nécessaires pour l'enregistrement de leur entreprise, et
            suivre des guides pas à pas pour comprendre les procédures à suivre.
            Grâce à des webinaires et des articles de blog offerts par ALT, ils
            ont également bénéficié de conseils pratiques sur la gestion d'une
            start-up et les meilleures pratiques juridiques.
          </Typography>

          <Typography color="blue-gray" className="pb-6 text-[20px] font-bold">
            3. Résolution d'un Conflit Familial
          </Typography>
        <Typography className="font-normal text-gray-500">
            <strong>Contexte :</strong> Une personne cherchait à résoudre un
            litige concernant l'héritage familial après le décès d'un parent, où
            plusieurs membres de la famille revendiquaient une part
            disproportionnée de l'héritage.
          </Typography>
        <Typography className="font-normal text-gray-500">
            <strong>Solution via ALT :</strong> En utilisant ALT, la personne a
            pu accéder à des lois sur l'héritage et des précédents judiciaires
            qui traitaient de cas similaires. La plateforme lui a fourni des
            modèles de documents pour préparer une répartition équitable de
            l'héritage et des conseils pratiques sur la médiation familiale.
            Avec l'aide d'un expert juridique consulté via ALT, la personne a pu
            parvenir à un accord amiable avec les autres membres de la famille,
            évitant ainsi un long et coûteux procès.
          </Typography>
        </div>
      </div>
    </section>
  );
}

export default Faqs4;