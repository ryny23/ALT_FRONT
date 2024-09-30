import React, { useEffect } from 'react';

const TidioChat = () => {
  useEffect(() => {
    // Ajouter le script Tidio
    <script src="//code.tidio.co/0zxbrw9vcj2qnhtlqlxabpkjdsihcxvj.js" async></script>
    const script = document.createElement('script');
    script.src = '//code.tidio.co/votre_code_unique.js'; // Remplacez par votre code Tidio
    script.async = true;
    document.body.appendChild(script);

    // Nettoyer le script si nécessaire lors du démontage du composant
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // Pas besoin de rendre quoi que ce soit visuellement, Tidio gère l'UI
};

export default TidioChat;
