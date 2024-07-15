export default function Widget() {
    return (
        <div className="flex h-screen bg-zinc-100">
          
          <div className="w-64 bg-white border-r">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">D</div>
                <div className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full">7 jours</div>
              </div>
            </div>
            <nav className="mt-6">
              <ul>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Décisions</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Commentaires</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Lois et règlements</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Documents parlementaires</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Directives et règlements UE</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Conventions collectives</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Conventions fiscales</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200">Avocats</li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200 flex justify-between">
                  <span>Entreprises</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">Nouveau</span>
                </li>
                <li className="px-4 py-2 text-zinc-700 hover:bg-zinc-200 flex justify-between">
                  <span>Actes et statuts</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">Nouveau</span>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="flex-1 p-6">
            
            <div className="flex items-center justify-between">
              <input type="text" placeholder="Essayez : prestation compensatoire de '60 000 euros'" className="w-1/2 px-4 py-2 border rounded-lg"/>
              <div className="flex items-center space-x-4">
                <button className="text-zinc-600 hover:text-zinc-800">Document Analyzer</button>
                <button className="text-zinc-600 hover:text-zinc-800">Dossiers</button>
                <button className="text-zinc-600 hover:text-zinc-800">Alertes</button>
                <button className="text-zinc-600 hover:text-zinc-800">Vous</button>
              </div>
            </div>
        
        <div className="mt-6">
          <h1 className="text-2xl font-bold">Doctrine IA Entreprises</h1>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Une question sur une entreprise ?</h2>
            <p className="mt-2 text-zinc-600">Posez votre question comme vous le feriez à un confrère ou à un collaborateur. Vous ne perdrez plus dans les documents d'entreprise. Notre IA vous fournit des réponses exhaustives et sourcées directement des documents et statuts d'une entreprise.</p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">Découvrir un exemple</button>
          </div>
        </div>
        
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Nouveautés. Façon Doctrine.</h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <img src="https://placehold.co/100x100" alt="Entreprises" className="w-full h-32 object-cover rounded-lg"/>
              <h3 className="mt-2 text-lg font-semibold">Entreprises</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <img src="https://placehold.co/100x100" alt="Actes et statuts" className="w-full h-32 object-cover rounded-lg"/>
              <h3 className="mt-2 text-lg font-semibold">Actes et statuts</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <img src="https://placehold.co/100x100" alt="Jobexit" className="w-full h-32 object-cover rounded-lg"/>
              <h3 className="mt-2 text-lg font-semibold">Jobexit</h3>
            </div>
          </div>
        </div>
        
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Document Analyzer</h2>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <p className="text-zinc-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque aliquam odio et faucibus. Proin eget ligula nec lorem varius malesuada.</p>
          </div>
        </div>
          </div>
        </div>
    )
}