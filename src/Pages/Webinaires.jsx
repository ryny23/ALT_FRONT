import React from 'react'
import Nav from '../Components/Nav'
import { Typography } from "@material-tailwind/react";
import test from '../assets/test.png'
import CTA3 from '../Components/CTA3';
import conf from '../assets/conf.png'
import vin from '../assets/vin.png'
import des from '../assets/des.png'
import temoignage from '../assets/temoignage.png'
import Footer from '../Components/Footer'

const Webinaires = () => {
  return (
    <div>
      <div>
      </div>
      <main className="py-[24px] px-4 sm:p-6 md:py-10 md:px-8 my-[80px]">
  <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-5xl lg:gap-x-20 lg:grid-cols-2">
    <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1">
      <h1 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-white">Enrichissez vos connaissances avec nos webinaires juridiques</h1>
      <p className="text-sm leading-4 font-medium text-white sm:text-green-500 dark:sm:text-green-400"></p>Webinaires
    </div>
    <div className="grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
      <img src={vin} alt="" class="w-full h-60 object-cover rounded-lg sm:h-52 sm:col-span-2 lg:col-span-full" loading="lazy"/>
      <img src={conf} alt="" class="hidden w-full h-52 object-cover rounded-lg sm:block sm:col-span-2 md:col-span-1 lg:row-start-2 lg:col-span-2 lg:h-32" loading="lazy"/>
      <img src={test} alt="" class="hidden w-full h-52 object-cover rounded-lg md:block lg:row-start-2 lg:col-span-2 lg:h-32" loading="lazy"/>
    </div>
    
    <p class=" text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-1 lg:row-start-4 lg:col-span-1 dark:text-slate-400">
    Chez ALT, nous sommes convaincus que le partage de connaissances est essentiel pour permettre aux professionnels du droit d'évoluer et d'exceller dans leur pratique. C'est pourquoi nous organisons régulièrement des webinaires animés par des experts reconnus sur des sujets juridiques d'actualité ou des thématiques métiers, pointues.
    </p>
  </div>
</main>

          <div class=" px-4 mx-auto max-w-screen-xl text-center lg:px-6">
            <div class="mx-auto max-w-screen-sm">
                <h2 class=" mb-6 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Webinaires à venir</h2>
                    <h3 class="pb-[15px] font-light text-gray-500 sm:text-xl dark:text-gray-400">Prochains rendez-vous</h3>
                    <p className='pb-[45px] sm:text-xl'>Listing des prochains webinaires avec pour chacun un bref descriptif, les dates/horaires, les intervenants et un lien pour s'inscrire.</p>

<div class="grid grid-flow-col grid-rows-2 grid-cols-3 gap-8">
  <div>
    <img className=' rounded-lg'src={vin} alt="" loading="lazy"/>
  </div>
  <div class="col-start-3">
    <img className=' rounded-lg' src={temoignage} alt="" loading="lazy"/>
  </div>
  <div>
    <img className=' rounded-lg' src={test} alt="" loading="lazy"/>
  </div>
  <div>
    <img className=' rounded-lg' src={conf} alt="" loading="lazy"/>
  </div>
  <div class="row-start-1 col-start-2 col-span-2">
    <img className=' rounded-lg' src={des} alt="" loading="lazy"/>
  </div>
</div>
          </div>
            </div>

          <div class="px-4 mx-auto max-w-screen-xl text-center lg:px-6">
            <div class="mx-auto max-w-screen-sm">
                <h2 class="mb-5 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Webinaires récents </h2>
                    <p class="mb-[40px] font-light text-gray-500 sm:text-xl dark:text-gray-400">Ressources à consulter: Accédez aux replays des derniers webinaires classés par thématique (droit des affaires, droit social, droit pénal, etc.) Chaque replay est accompagné d'un résumé, des PDFs des supports de présentation à télécharger et d'un lien pour visionner.</p>
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
             Webinaire
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
             Webinaire
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
             Webinaire
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
                    <p className=" sm:text-xl dark:text-gray-400">Ils ont animé nos webinaires <br/>Mettez en avant quelques intervenants de renom (professeurs d'université, avocats réputés, magistrats, etc.) avec une brève bio, une photo et un lien vers leurs webinaires.</p>
            </div>

          </div>
          <section class="bg-white dark:bg-gray-900">
  <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
      <figure class="max-w-screen-md mx-auto">
          <svg class="h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/>
          </svg> 
          <blockquote>
              <p class="text-2xl font-medium text-gray-900 dark:text-white">"Les webinaires d'ALT sont devenus pour moi un véritable rendez-vous incontournable pour me tenir informé des dernières évolutions juridiques dans une ambiance propice aux échanges."</p>
          </blockquote>
          <figcaption class="flex items-center justify-center mt-6 space-x-3">
              <img class="w-6 h-6 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" alt="profile picture"/>
              <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                  <div class="pr-3 font-medium text-gray-900 dark:text-white">M. Olinga</div>
                  <div class="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">Avocat associé</div>
              </div>
          </figcaption>
      </figure>
  </div>
</section>
<CTA3/>
    </div>
  )
}

export default Webinaires