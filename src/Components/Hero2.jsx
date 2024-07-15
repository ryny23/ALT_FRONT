import React from 'react'
import recherche from '../assets/recherche.png'

const Hero2 = () => {
  return (
    <section class="py-[65px] bg-white dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
        <h2 className="text-base font-semibold leading-7 text-green-600">Fonctionnalités</h2>
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Accedez aux outils de recherche intelligents</h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Profitez de la pertinence de la recherche et affinez chaque requête avec nos filtres. Ayez la certitude d'avoir fait le tour de votre sujet..</p>
        </div>
        <div class=" w-full rounded-full lg:mt-0 lg:col-span-5 lg:flex">
            <img className=' rounded-3xl' src={recherche} alt="mockup"/>
        </div>                
    </div>
</section>
  )
}

export default Hero2