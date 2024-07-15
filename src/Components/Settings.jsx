import React from 'react'

const Settings = () => {
  return (
    <div>
        <div className="flex flex-col items-center justify-center bg-background text-foreground">
          <div className="w-full max-w-4xl p-6 rounded-lg">
            <div className="flex items-center mb-6">
              <img src="https://placehold.co/40x40" alt="Doctrine logo" className="mr-4"/>
              <h1 className="text-2xl font-bold">ALT</h1>
            </div>
            <h2 className="text-xl font-semibold mb-4">Bonjour Ryan, bienvenue sur Doctrine.</h2>
            <p className="text-lg mb-6">Quels domaines de droit vous intéressent ?</p>
            <p className="text-muted-foreground mb-6">Ceci nous aidera à vous recommander des informations juridiques plus pertinentes.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit Civil" className="mr-2"/>
                Droit Civil
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit des Affaires" className="mr-2"/>
                Droit des Affaires
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit Social" className="mr-2"/>
                Droit Social
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit Pénal" className="mr-2"/>
                Droit Pénal
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit Public" className="mr-2"/>
                Droit Public
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit Européen et International" className="mr-2"/>
                Droit Européen et International
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit Fiscal" className="mr-2"/>
                Droit Fiscal
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit de la Propriété Intellectuelle" className="mr-2"/>
                Droit de la Propriété Intellectuelle
              </button>
              <button className="flex items-center justify-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">
                <img src="https://placehold.co/24x24" alt="Droit Constitutionnel" className="mr-2"/>
                Droit Constitutionnel
              </button>
            </div>
            <div className="flex justify-between">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80">Valider la sélection</button>
              <button className="text-muted-foreground hover:underline">Ignorer</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Settings