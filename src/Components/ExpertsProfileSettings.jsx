import React, { useState } from 'react';
import { Textarea } from 'flowbite-react'
import { CameraIcon } from '@heroicons/react/20/solid'
import logo from './../assets/logo.png'
import { Button } from 'flowbite-react';
// import Option from '@material-tailwind/react/components/Select/Option';
import { Select } from '@material-tailwind/react';
// import { Select } from '@headlessui/react';
import { Option } from '@material-tailwind/react';




const ExpertsProfileSettings = () => {
        const decisions = [
          'Décision 1',
          'Décision 2',
          'Décision 3',
          'Décision 4',
          'Décision 5'
        ];
      
        const [selectedDecisions, setSelectedDecisions] = useState(['', '', '']);
      
        const handleSelectChange = (index, event) => {
          const newSelectedDecisions = [...selectedDecisions];
          newSelectedDecisions[index] = event.target.value;
          setSelectedDecisions(newSelectedDecisions);
        };


        const legalDomains = [
          'Droit des affaires',
          'Droit social',
          'Droit pénal',
          'Droit civil',
          'Droit administratif',
          'Droit fiscal',
          'Droit international',
          'Droit de l’environnement',
          'Droit immobilier',
        ];
      
        const [selectedDomains, setSelectedDomains] = useState([]);
      
        const toggleDomain = (domain) => {
          if (selectedDomains.includes(domain)) {
            setSelectedDomains(selectedDomains.filter((d) => d !== domain));
          } else {
            setSelectedDomains([...selectedDomains, domain]);
          }
        };
      

  return (
    <div>

<div className="flex flex-col h-screen">
  
  <div className="flex-1 flex flex-col md:flex-row">
    <div className="bg-[#f0f0f0] p-6 border-r border-input w-full md:w-2/5 hidden md:block">
    <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <span className="relative flex shrink-0 overflow-hidden rounded-full w-20 h-20">
          <img src={logo} alt="Avatar" className="rounded-full" />
          </span>
          <CameraIcon className="w-4 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground absolute bottom-0 right-0 bg-[#f0f0f0] rounded-full h-4 text-slate-900" />
              </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Jean Dupont</h2>
          <p className="text-[#666666]">Expert en droit des entreprises</p>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center justify-center">
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
            <div className="flex items-center justify-center">
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
        <div className="flex flex-col gap-2 w-full">
          <div>
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
          <div>
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
                <p className="text-[#666666]">
                  Spécialisé dans le droit des sociétés et les transactions commerciales.
                </p>
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
          <div>
            <h3 className="text-sm font-medium mb-1">Distinctions</h3>
            <p className="text-[#666666]">
              Reconnu comme l'un des meilleurs experts en droit des entreprises par Legal 500
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Admissions au barreau</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[#666666]">Californie</p>
                <div className="text-[#666666] text-sm">2010</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Dernières décisions</h3>
            <div className="grid gap-4">
      
    </div>
            <div className="grid gap-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 p-6 w-full md:w-3/5">
      <h1 className="text-2xl font-bold mb-4 text-green-500">Créez votre profil d'expert</h1>
      <form className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="name"
          >
            Nom
          </label>
          <input
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            id="name"
            placeholder="Jean Dupont"
          />
        </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="title"
          >
            Titre
          </label>
          <input
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            id="title"
            placeholder="Expert en droit des entreprises"
          />
        </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="email"
          >
            Email
          </label>
          <input
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            id="email"
            placeholder="jean.dupont@example.com"
            type="email"
          />
        </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="phone"
          >
            Téléphone
          </label>
          <input
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            id="phone"
            placeholder="+33 1 23 45 67 89"
            type="tel"
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="specialties"
          >
            Spécialités
          </label>
          <div className="grid grid-cols-3 gap-2">
          {legalDomains.map((domain) => (
            <div
              key={domain}
              className={`px-10 py-2 text-sm p-4 border rounded-full cursor-pointer transition-colors duration-300 
                ${selectedDomains.includes(domain) ? 'bg-green-500 text-white' : 'bg-white text-gray-900'} 
                dark:bg-gray-700 dark:text-gray-200`}
              onClick={() => toggleDomain(domain)}
            >
              {domain}
            </div>
          ))}
        </div>
        </div>
        <div className="grid gap-2 col-span-1 md:col-span-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="experience"
          >
            Expérience
          </label>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                  id="experience-title"
                  placeholder="Titre du poste"
                />
                <div className="grid gap-1 sm:flex sm:items-center sm:gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-start"
                    placeholder="Début"
                    type="month"
                  />
                  <span className="text-[#666666]">-</span>
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-end"
                    placeholder="Fin"
                    type="month"
                  />
                </div>
              </div>
              <textarea
                className="flex min-h-[80px] w-full rounded-mtext-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                id="experience-description"
                rows="3"
                placeholder="Description des missions"
              ></textarea>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                  id="experience-title"
                  placeholder="Titre du poste"
                />
                <div className="grid gap-1 sm:flex sm:items-center sm:gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-start"
                    placeholder="Début"
                    type="month"
                  />
                  <span className="text-[#666666]">-</span>
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-end"
                    placeholder="Fin"
                    type="month"
                  />
                </div>
              </div>
              <textarea
                className="flex min-h-[80px] w-full rounded-mtext-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                id="experience-description"
                rows="3"
                placeholder="Description des missions"
              ></textarea>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                  id="experience-title"
                  placeholder="Titre du poste"
                />
                <div className="grid gap-1 sm:flex sm:items-center sm:gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-start"
                    placeholder="Début"
                    type="month"
                  />
                  <span className="text-[#666666]">-</span>
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-end"
                    placeholder="Fin"
                    type="month"
                  />
                </div>
              </div>
              <textarea
                className="flex min-h-[80px] w-full rounded-mtext-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                id="experience-description"
                rows="3"
                placeholder="Description des missions"
              ></textarea>
            </div>
          </div>
        </div>
        <div>
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
              for="bar-admission-location"
            >
              Lieu d'admission
            </label>
            <input
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              id="bar-admission-location"
              placeholder="Californie"
            />
          </div>
          <div>
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
              for="bar-admission-month"
            >
              month d'admission
            </label>
            <input
              class="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              id="bar-admission-month"
              placeholder="2010"
              type="month"
            />
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <h3 class="text-green-500 font-medium">Dernières décisions</h3>
          <div class="grid gap-2">
          {selectedDecisions.map((selectedDecision, index) => (
        <div key={index} className="flex flex-col">
          <label className="mb-2 text-gray-700">Sélectionnez une décision:</label>
          <select
            value={selectedDecision}
            onChange={(event) => handleSelectChange(index, event)}
            className="bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500 p-2 rounded"
          >
            <option value="" disabled>Choisir une décision</option>
            {decisions.map((decision, i) => (
              <option key={i} value={decision}>{decision}</option>
            ))}
          </select>
        </div>
      ))}
          </div>
          </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="accolades"
          >
            Distinctions
          </label>
              <Textarea
                id="accolades"
                rows={3}
                placeholder="Reconnu comme l'un des meilleurs experts en droit des entreprises par Legal 500"
                className
              />
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button type="submit" className="w-full sm:w-auto bg-green-500 text-white hover:bg-geen-500">
                Enregistrer le profil
              </Button>
        </div>
      </form>
    </div>
  </div>
</div>
    </div>
  )
}

export default ExpertsProfileSettings