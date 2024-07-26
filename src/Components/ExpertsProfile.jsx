import React from 'react'

const ExpertsProfile = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
    <div className="flex-1 flex justify-center items-center">
    <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <span className="relative flex shrink-0 overflow-hidden rounded-full w-20 h-20">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">JD</span>
          </span>
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 absolute bottom-0 right-0 bg-white rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-4 h-4 text-[#008000]"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
            <span className="sr-only">Change profile photo</span>
          </button>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">Jean Dupont</h2>
          <p className="text-[#666666]">Expert en droit des entreprises</p>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center justify-center md:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-4 h-4 mr-1 text-[#666666]"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="text-[#666666]">+33 1 23 45 67 89</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-4 h-4 mr-1 text-[#666666]"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span className="text-[#666666]">jean.dupont@example.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Spécialités</h3>
        <div className="flex flex-wrap gap-2">
          <div
            className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-slate-900 text-white"
            data-v0-t="badge"
          >
            Droit des sociétés
          </div>
          <div
            className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-slate-900 text-white"
            data-v0-t="badge"
          >
            Fusions et acquisitions
          </div>
          <div
            className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-slate-900 text-white"
            data-v0-t="badge"
          >
            Transactions commerciales
          </div>
          <div
            className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-slate-900 text-white"
            data-v0-t="badge"
          >
            Propriété intellectuelle
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Expérience</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Avocat associé</h4>
              <div className="text-[#666666] text-sm">2015 - Présent</div>
            </div>
            <p className="text-[#666666]">
              Responsable des fusions et acquisitions, transactions commerciales et propriété intellectuelle.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Avocat</h4>
              <div className="text-[#666666] text-sm">2010 - 2015</div>
            </div>
            <p className="text-[#666666]">Spécialisé dans le droit des sociétés et les transactions commerciales.</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Stagiaire</h4>
              <div className="text-[#666666] text-sm">2008 - 2010</div>
            </div>
            <p className="text-[#666666]">Stage dans un cabinet d'avocats spécialisé en droit des entreprises.</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Distinctions</h3>
        <p className="text-[#666666]">
          Reconnu comme l'un des meilleurs experts en droit des entreprises par Legal 500
        </p>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Admissions au barreau</h3>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[#666666]">Californie</p>
            <div className="text-[#666666] text-sm">2010</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default ExpertsProfile