import React from 'react'

const CTA3 = () => {
  return (
    <div>
        <div className="bg-white dark:bg-slate-900">
        <div className="mx-auto will-change-scroll h-auto">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl  sm:px-16 md:pt-24 flex gap-x-20">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 :left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>


            <div className="mx-auto max-w-md flex-auto py-32 text-center">
              <h2 className="text-[60px] font-bold tracking-tight text-white sm:text-4xl">
              Vous etes prets ?
              </h2>
              <p className="mt-6 text-l leading-8 text-gray-300">
              Centralisez, analysez et maîtrisez l'ensemble du droit camerounais.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className=" bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Commencez
                </a>
                <a href="/pourquoi-nous" className="text-sm font-semibold leading-6 text-white">
                  Lire plus <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CTA3