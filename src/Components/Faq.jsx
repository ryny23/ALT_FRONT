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
      </div>
    </section>
  );
}

export default Faqs4;