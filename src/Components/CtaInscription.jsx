import React from 'react'
import {NavLink} from 'react-router-dom'

const CtaInscription = () => {
  return (
    <div className="rounded-3xl px-10 mt-20 bg-white dark:bg-slate-900">
          <div className="rounded-3xl mx-auto will-change-scroll h-auto">
            <div className=" rounded-3xl relative isolate overflow-hidden bg-green-700 px-6 pt-16 shadow-2xl sm:px-6 md:pt-10 flex gap-x-20">
                <svg
                  viewBox="0 0 1024 1024"
                  className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 :left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                  aria-hidden="true">
                      <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                      <defs>
                        <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                          <stop stopColor="#7775D6" />
                          <stop offset={1} stopColor="#E935C1" />
                        </radialGradient>
                      </defs>
                </svg>


                <div className="mx-auto max-w-md flex-auto py-10 text-center">
                  <h2 className="text-[30px] font-bold tracking-tight text-white sm:text-[40px]">
                  Rejoignez l'avenir de la pratique juridique
                  </h2>
                  <p className="pb-6 mt-6 text-l leading-8 text-gray-300">
                  Inscrivez-vous dès maintenant pour bénéficier d'un accès gratuit d'un mois à notre plateforme premium.
                  </p>
                  <NavLink to="/authform?tab=register" className='bg-gradient-to-br from-slate-800 to-slate-900 text-white py-2 px-4 transition-all duration-300 rounded hover:bg-white hover:text-cyan-200'>
                    
                    <strong>S'inscrire</strong>
                    
                  </NavLink>
                </div>
            </div>
          </div>
      </div>
  )
}

export default CtaInscription