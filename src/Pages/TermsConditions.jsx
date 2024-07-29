import React from 'react';
import { NavLink } from 'react-router-dom';

const PrivacyPolicyAndTerms = () => {
  return (
    <div className="container mx-auto p-6">
<NavLink to="/"><button className='text-white items-center bg-green-500 rounded-lg p-3  px-4 py-2 mb-6 hover:bg-slate-500'>Revenir au menu principal</button></NavLink>
      <div className="bg-white shadow-md rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4">POLITIQUE DE CONFIDENTIALITE D’AFRICAN LEGAL TECH</h1>
        <p>
          Bienvenue sur la plateforme African Legal Tech (ALT). Nous nous engageons à protéger la confidentialité de nos utilisateurs et à respecter les réglementations en vigueur en matière de protection des données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, et protégeons vos informations personnelles.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Collecte des Informations</h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">Informations collectées automatiquement :</h3>
        <p><strong>Données de navigation :</strong> Lors de votre visite sur notre site, nous recueillons automatiquement des informations telles que votre adresse IP, le type de navigateur utilisé, les pages visitées, et le temps passé sur chaque page. Ces données nous aident à améliorer notre plateforme et à mieux comprendre comment les utilisateurs interagissent avec nos services.</p>
        <p><strong>Cookies :</strong> Nous utilisons des cookies pour améliorer votre expérience utilisateur. Les cookies sont de petits fichiers stockés sur votre appareil qui nous permettent de reconnaître vos préférences et de personnaliser votre visite. Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur.</p>

        <h3 className="text-xl font-semibold mt-4 mb-2">Informations fournies par les utilisateurs :</h3>
        <p><strong>Inscription et Compte Utilisateur :</strong> Lorsque vous créez un compte sur ALT, nous collectons des informations personnelles telles que votre nom, adresse e-mail, numéro de téléphone, et d'autres informations pertinentes pour la gestion de votre compte.</p>
        <p><strong>Formulaires de Contact et Soumissions :</strong> Si vous nous contactez via un formulaire de contact ou soumettez des documents pour analyse, nous recueillons les informations fournies, y compris les fichiers téléchargés et les messages envoyés.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Utilisation des Informations</h2>
        <p>Vos informations personnelles sont utilisées pour les finalités suivantes :</p>
        <ul className="list-disc list-inside">
          <li><strong>Fourniture des Services :</strong> Nous utilisons vos informations pour fournir, maintenir, et améliorer les services disponibles sur ALT, notamment la centralisation des textes juridiques, l'accès aux modèles de documents, et l'analyse des documents par nos experts juridiques.</li>
          <li><strong>Personnalisation :</strong> Vos préférences et données de navigation nous permettent de personnaliser votre expérience sur la plateforme, de vous recommander des contenus pertinents et de vous offrir des services adaptés à vos besoins.</li>
          <li><strong>Communication :</strong> Nous utilisons vos coordonnées pour vous envoyer des notifications importantes, des mises à jour sur nos services, des informations sur les événements de la communauté juridique, et des offres promotionnelles si vous y avez consenti.</li>
          <li><strong>Analyse et Amélioration :</strong> Les données collectées automatiquement sont utilisées pour analyser l'utilisation de notre site, identifier les tendances et les problèmes, et améliorer les fonctionnalités et la performance de notre plateforme.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Partage des Informations</h2>
        <p>ALT ne vend, n'échange, ni ne loue vos informations personnelles à des tiers. Nous pouvons partager vos informations avec des partenaires de confiance uniquement dans les circonstances suivantes :</p>
        <ul className="list-disc list-inside">
          <li><strong>Fournisseurs de Services :</strong> Nous collaborons avec des prestataires de services tiers pour effectuer des fonctions en notre nom, telles que l'hébergement de notre site, l'analyse de données, et l'envoi de communications. Ces prestataires ont accès aux informations nécessaires pour réaliser leurs fonctions, mais ne peuvent les utiliser à d'autres fins.</li>
          <li><strong>Obligations Légales :</strong> Nous pouvons divulguer vos informations si nous y sommes tenus par la loi ou si nous croyons en toute bonne foi qu'une telle action est nécessaire pour se conformer à une obligation légale, protéger et défendre nos droits ou notre propriété, prévenir une fraude ou une activité illégale, ou protéger la sécurité des utilisateurs de notre plateforme.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Sécurité des Données</h2>
        <p>Nous prenons des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès, divulgation, modification ou destruction non autorisés. Cela inclut l'utilisation de technologies de cryptage, de pare-feux, et de procédures de sécurité pour garantir la confidentialité et l'intégrité de vos données.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Vos Droits</h2>
        <p>En vertu de la réglementation applicable, vous disposez des droits suivants concernant vos informations personnelles :</p>
        <ul className="list-disc list-inside">
          <li><strong>Accès et Rectification :</strong> Vous pouvez accéder à vos informations personnelles et demander leur correction ou mise à jour si elles sont inexactes.</li>
          <li><strong>Suppression :</strong> Vous pouvez demander la suppression de vos informations personnelles, sous réserve des obligations légales de conservation des données.</li>
          <li><strong>Opposition et Limitation :</strong> Vous pouvez vous opposer au traitement de vos données personnelles ou demander une limitation de leur utilisation.</li>
          <li><strong>Portabilité :</strong> Vous avez le droit de demander une copie de vos données personnelles dans un format structuré, couramment utilisé et lisible par machine.</li>
        </ul>
        <p>Pour exercer ces droits, veuillez nous contacter à l'adresse suivante : privacy@africanlegaltech.com.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Modifications de la Politique de Confidentialité</h2>
        <p>ALT se réserve le droit de modifier cette politique de confidentialité à tout moment. Nous vous informerons de tout changement significatif par le biais d'une notification sur notre site ou par e-mail. Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de protection des données.</p>

        <p>Contact : XXXXXX</p>
        <p>Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité ou nos pratiques en matière de protection des données, veuillez nous contacter à :</p>
        <p>African Legal Tech (ALT) Email: XXXXXXX</p>
        <p>Merci d'utiliser ALT et de nous faire confiance pour la gestion de vos données juridiques et personnelles.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4">Conditions d'Utilisation de la Plateforme African Legal Tech (ALT)</h1>
        <p>Bienvenue sur African Legal Tech (ALT). En accédant à notre plateforme et en utilisant nos services, vous acceptez de respecter les présentes conditions d'utilisation. Nous vous invitons à lire attentivement ce document avant d'utiliser notre site. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Objet de la Plateforme</h2>
        <p>ALT est une plateforme dédiée à la centralisation des textes juridiques majeurs au Cameroun, incluant les lois, les jurisprudences, et les décrets. Nous offrons également une gamme de services à valeur ajoutée autour de ces données, tels que des modèles de documents, des analyses juridiques, et des consultations avec des experts.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Accès à la Plateforme</h2>
        <p><strong>Inscription :</strong> L'accès à certaines fonctionnalités de notre plateforme nécessite la création d'un compte utilisateur. Vous vous engagez à fournir des informations exactes et à jour lors de votre inscription.</p>
        <p><strong>Sécurité du Compte :</strong> Vous êtes responsable de la confidentialité de votre identifiant et de votre mot de passe. Toute activité effectuée à partir de votre compte est sous votre responsabilité. Veuillez nous informer immédiatement de toute utilisation non autorisée de votre compte.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Utilisation des Services</h2>
        <p><strong>Usage Personnel et Professionnel :</strong> Vous pouvez utiliser les services d'ALT pour des besoins personnels ou professionnels, dans le respect des lois en vigueur et des droits des tiers.</p>
        <p><strong>Contenu Utilisateur :</strong> Vous êtes responsable des informations et documents que vous soumettez sur notre plateforme. Vous vous engagez à ne pas publier de contenu illicite, diffamatoire, ou contraire aux bonnes mœurs.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Propriété Intellectuelle</h2>
        <p>Tous les contenus disponibles sur ALT, y compris les textes, les graphiques, les logos, et les logiciels, sont la propriété exclusive d'ALT ou de ses partenaires. Toute reproduction, distribution, ou modification de ces contenus sans autorisation préalable est strictement interdite.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Limitation de Responsabilité</h2>
        <p>ALT met tout en œuvre pour fournir des informations juridiques précises et à jour. Cependant, nous ne pouvons garantir l'exactitude, l'exhaustivité, ou la pertinence des contenus publiés sur notre plateforme. Vous utilisez nos services à vos propres risques. ALT ne peut être tenue responsable des dommages directs ou indirects résultant de l'utilisation de notre site.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Modification des Conditions</h2>
        <p>ALT se réserve le droit de modifier les présentes conditions d'utilisation à tout moment. Les modifications seront effectives dès leur publication sur notre site. Nous vous encourageons à consulter régulièrement cette page pour rester informé des mises à jour.</p>

        <p>Contact :</p>
        <p>Si vous avez des questions ou des préoccupations concernant nos conditions d'utilisation, veuillez nous contacter à :</p>
        <p>Email : XXXXXXX</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyAndTerms;