import React, { useState, useEffect } from 'react';




const Deco = () => {
    const [showConfirm, setShowConfirm] = useState(false);
      
          const handleLogout = () => {
              // Logic for logging out the user
              localStorage.removeItem('token');
          localStorage.removeItem('conUserName');
          // Redirection vers la page d'accueil
          window.location.href = "/";
              console.log('User logged out');
              setShowConfirm(false);
          };
    return (
    <div className="sm:ml-64">
        <div className="rounded-lg">
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
              <div className="dark:bg-gray-800 bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Confirmer la déconnexion
                </h2>
                <p className="mb-6">
                  Êtes-vous sûr de vouloir vous déconnecter ?
                </p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 dark:hover:bg-gray-950 hover:bg-gray-300"
                    onClick={() => setShowConfirm(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-4 py-2 ml-2 text-white bg-red-500 hover:bg-red-600"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default Deco;