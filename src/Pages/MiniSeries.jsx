import React from 'react'
import Nav from '../Components/Nav'
import { Typography } from "@material-tailwind/react";
import CTA3 from '../Components/CTA3';
import Footer from '../Components/Footer'
import Carousel from '../Components/Carousel';

const MiniSeries = () => {
  return (
    <div>
      <div>
      <div>
      </div>
     
      <section class="bg-white dark:bg-gray-900">
         <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">Devenez incollable sur les sujets juridiques clés avec nos mini-séries</h2>
            <p class="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Chez ALT, nous savons que le droit est un vaste univers en constante évolution. C'est pourquoi nous avons conçu des programmes de formation vidéo, sous forme de mini-séries thématiques, pour vous permettre d'approfondir vos connaissances sur des sujets juridiques incontournables pour votre pratique..</p>
          </div>
        </div>
      </section>

      <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div class="max-w-screen-md">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Choisissez votre parcours d'apprentissage</h2>
            <p class="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">Listing des différentes thématiques abordées (droit des contrats, droit de la concurrence, droit des sociétés, etc.) avec pour chacune un bref descriptif, les vidéos/épisodes qui la composent et un bouton "Commencer cette série".</p>
            <div className=' mb-10 flex items-center justify-center gap-[100px]'>
    </div>


              <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a href="#" class="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                    Commercer
                </a>
                <a href="#" class="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <svg class="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                    Voir plus
                </a>  
            </div>
        </div>
    </div>
</section>

          <div class="px-4 mx-auto max-w-screen-xl text-center lg:px-6">
            <div class="mx-auto max-w-screen-sm">
                <h2 class="mb-5 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Un concept vidéo adapté aux professionnels</h2>
                    <p class="mb-16 font-light text-gray-500 sm:text-xl dark:text-gray-400">Décrivez le format court et dense des vidéos (10-15 minutes), l'approche pédagogique avec des cas pratiques, des visuels, etc. Mettez en avant les avantages de ce format (compatible avec les emplois du temps chargés, visionnable n'importe où, etc.)</p>
            </div>
          </div>

          <div className=' mb-10 flex items-center justify-center gap-[100px]'>
 
     <figure className="relative h-[300px] w-[300px]">
       <img
         className="h-full w-full rounded-xl object-cover object-center"
         src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
         alt="nature image"
       />
       <figcaption className="absolute -bottom-4 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
         <div>
           <Typography variant="h5" color="blue-gray">
             Mini-série #125
           </Typography>
           <Typography color="gray" className="mt-2 font-normal">
             20 July 2022
           </Typography>
         </div>
       </figcaption>
     </figure>

     <figure className="relative h-[300px] w-[300px]">
       <img
         className="h-full w-full rounded-xl object-cover object-center"
         src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
         alt="nature image"
       />
       <figcaption className="absolute -bottom-4 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
         <div>
           <Typography variant="h5" color="blue-gray">
             Mini-série #125
           </Typography>
           <Typography color="gray" className="mt-2 font-normal">
             20 July 2022
           </Typography>
         </div>
       </figcaption>
     </figure>

     <figure className="relative h-[300px] w-[300px]">
       <img
         className="h-full w-full rounded-xl object-cover object-center"
         src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
         alt="nature image"
       />
       <figcaption className="absolute -bottom-4 left-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
         <div>
           <Typography variant="h5" color="blue-gray">
             Mini-série #125
           </Typography>
           <Typography color="gray" className="mt-2 font-normal">
             20 July 2022
           </Typography>
         </div>
       </figcaption>
     </figure>

          </div>


     <div className="px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm">
                <h2 className="mb-5 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Intervenants</h2>
                    <p className=" sm:text-xl dark:text-gray-400"><strong>Des experts de renom à la caméra </strong><br />Mettez en avant 2-3 intervenants phares (avocats, universitaires, etc.) avec une photo, une brève bio et un extrait vidéo illustrant leur qualité pédagogique.</p>
            </div>

          </div>
          <section class="bg-white dark:bg-gray-900">
  <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
      <figure class="max-w-screen-md mx-auto">
          <svg class="h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/>
          </svg> 
          <blockquote>
              <p class="text-2xl font-medium text-gray-900 dark:text-white">"Les mini-séries d'ALT sont un excellent moyen d'approfondir ses connaissances de façon très pragmatique. Les vidéos sont claires, denses et abordent des cas concrets, ce qui les rend particulièrement précieuses."</p>
          </blockquote>
          <figcaption class="flex items-center justify-center mt-6 space-x-3">
              <img class="w-6 h-6 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" alt="profile picture"/>
              <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                  <div class="pr-3 font-medium text-gray-900 dark:text-white"> Mme Kamwa</div>
                  <div class="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">juriste en entreprise</div>
              </div>
          </figcaption>
      </figure>
  </div>
</section>
<CTA3/>
    </div>
    </div>
  )
}

export default MiniSeries