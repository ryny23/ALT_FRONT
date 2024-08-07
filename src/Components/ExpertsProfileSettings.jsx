import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import anime from '../assets/anime.svg'
import { Textarea } from 'flowbite-react'
import { CameraIcon } from '@heroicons/react/20/solid'
import logo from './../assets/logo.png'
import { Button } from 'flowbite-react';
// import Option from '@material-tailwind/react/components/Select/Option';
// import { Select } from '@material-tailwind/react';
// import { Select } from '@headlessui/react';
import { Option } from '@material-tailwind/react';
import Select from 'react-select';




const ExpertsProfileSettings = () => {
  const [decisions, setDecisions] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState({
      decision1: null,
      decision2: null,
      decision3: null
  });

      
  const handleSelectChange = (selectedOption, name) => {
    setSelectedDecisions(prevState => ({
        ...prevState,
        [name]: selectedOption
    }));
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


       
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const email = localStorage.getItem('conUserEmail');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [titre, setTitre] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [titreexp1, setTitreExp1] = useState('');
  const [titreexp2, setTitreExp2] = useState('');
  const [titreexp3, setTitreExp3] = useState('');
  const [desexp1, setDesExp1] = useState('');
  const [desexp2, setDesExp2] = useState('');
  const [desexp3, setDesExp3] = useState('');
  const [lieubarreau, setLieuBarreau] = useState('');
  const [datebarreau, setDateBarreau] = useState('');
  const [disponibilite, setDisponibilite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarId, setAvatarId] = useState(null);

  const [state, setState] = useState({
    loading: true,
    error: ''
  });
  

 

  const fileInputRef = useRef(null);

  const handleAvatarChangeClick = () => {
      fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('post', '0'); // This can be any valid post ID or 0 for unattached files

          try {
              const token = localStorage.getItem('token');
              const response = await axios.post('https://alt.back.qilinsa.com/wp-json/wp/v2/media', formData, {
                  headers: {
                      'Content-Disposition': `attachment; filename="${file.name}"`,
                      Authorization: `Bearer ${token}`,
                  },
              });

              const uploadedImageId = response.data.id;
              setAvatarId(uploadedImageId);

              // Update user acf avatar field
              await axios.put('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
                  acf: {
                      avatar: uploadedImageId,
                  },
              }, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              // Fetch the new avatar URL
              const newAvatarUrl = response.data.source_url;
              setAvatarUrl(newAvatarUrl);

              alert('Avatar updated successfully!');
          } catch (error) {
              console.error('Error uploading avatar:', error);
              alert('Error uploading avatar. Please try again.');
          }
      }
  };

 

  const handleSaveChanges = async (event) => {
      event.preventDefault();

      try {
          const token = localStorage.getItem('token');

          const response = await axios.patch('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
              acf: {
                  nom,
                  adresse: address,
                  titre: titre,
                  tel: phone,
                  specialite: selectedDomains,
                  titreexp1: titreexp1,
                  titreexp2: titreexp2,
                  titreexp3: titreexp3,
                  desexp1: desexp1,
                  desexp2: desexp2,
                  desexp3: desexp3,
                  lieubarreau: lieubarreau,
                  disponibilite: disponibilite,
                  decision1: selectedDecisions.decision1 ? selectedDecisions.decision1.value : null,
                  decision2: selectedDecisions.decision2 ? selectedDecisions.decision2.value : null,
                  decision3: selectedDecisions.decision3 ? selectedDecisions.decision3.value : null,
                  datebarreau: datebarreau.replace(/-/g, ''),
                //   avatar: avatarId,
              },
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          console.log('User information updated successfully:', response.data);
          alert('Informations personnelles mises à jour avec succès!');
      } catch (error) {
          console.error('Error updating user information:', error);
          setError('Erreur lors de la mise à jour des informations. Veuillez réessayer.');
      }
  };

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const token = localStorage.getItem('token');
              const response = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              // Fetch all decisions from WordPress
              const response1 = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/decisions');
              const options = response1.data.map(decision => ({
                  value: decision.id,
                  label: decision.title.rendered
              }));
              setDecisions(options);

              const userData = response.data;
              setNom(userData.acf.nom);
              setPrenom(userData.acf.prenom);
              setUsername(userData.name);
              setPhone(userData.acf.tel);
              setGender(userData.acf.sexe);
              setAddress(userData.acf.adresse);
              setCompany(userData.acf.entreprise);
              setTitre(userData.acf.titre);
              setTitreExp1(userData.acf.titreexp1);
              setTitreExp2(userData.acf.titreexp2);
              setTitreExp3(userData.acf.titreexp3);
              setDesExp1(userData.acf.desexp1);
              setDesExp2(userData.acf.desexp2);
              setDesExp3(userData.acf.desexp3);
              setLieuBarreau(userData.acf.lieubarreau);
              setDisponibilite(userData.acf.disponibilite);

              setSelectedDecisions({
                decision1: options.find(option => option.value === userData.acf.decision1) || null,
                decision2: options.find(option => option.value === userData.acf.decision2) || null,
                decision3: options.find(option => option.value === userData.acf.decision3) || null
            });

              const avatarId = userData.acf.avatar;
              if (avatarId) {
                  setAvatarId(avatarId);
                  const avatarResponse = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/media/${avatarId}`);
                  setAvatarUrl(avatarResponse.data.source_url);
              }

              if (userData.acf) {
                if (userData.acf.specialite) {
                  setSelectedDomains(userData.acf.specialite);
                }
                
              }

              const datebarreauFromApi = userData.acf.datebarreau;
              if (datebarreauFromApi) {
                  const year = datebarreauFromApi.substr(0, 4);
                  const month = datebarreauFromApi.substr(4, 2);
                  const day = datebarreauFromApi.substr(6, 2);
                  const formattedDateBarreau = `${year}-${month}-${day}`;
                  setDateBarreau(formattedDateBarreau);
              }
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
          setState({ loading: false, error: '' });
      };

      fetchUserData();
  }, []);

  

  

  const { loading } = state;

  if (loading) {
    return (
      
      <div className="flex justify-center items-center h-screen">
      
        <img src={anime}></img>
      
    </div>
    );
  }


  

      

  return (
    <div>

<div className="flex flex-col h-screen">
  
  <div className="flex-1 flex flex-col md:flex-row">
    <div className="bg-[#f0f0f0] p-6 border-r border-input w-full md:w-2/5 hidden md:block">
    <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <span className="relative flex shrink-0 overflow-hidden rounded-full w-20 h-20">
          <img src={avatarUrl || "https://placehold.co/96x96"} alt="Avatar" className="rounded-full" />
          </span>
          <button onClick={handleAvatarChangeClick}>
          <CameraIcon type="file" className="w-4 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground absolute bottom-0 right-0 bg-[#f0f0f0] rounded-full h-4 text-slate-900" 
                              />
          </button>
          <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: 'none' }}
                              onChange={handleFileChange}
                              accept="image/*"
                          />
          
              </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{nom}</h2>
          <p className="text-[#666666]">{titre}</p>
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
              <span className="text-[#666666]">{phone}</span>
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
              <span className="text-[#666666]">{email}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div>
            <h3 className="text-sm font-medium mb-1">Domaine d'expertise</h3>
            {selectedDomains.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {selectedDomains.map((domain, index) => (
              <li className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-slate-900 text-white" key={index}>{domain}</li>
            ))}
          </ul>
        ) : (
          <p>No domains selected</p>
        )}
            
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Expérience</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{titreexp1}</h4>
                  {/* <div className="text-[#666666] text-sm">2015 - Présent</div> */}
                </div>
                <p className="text-[#666666]">
                  {desexp1}
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{titreexp2}</h4>
                  
                </div>
                <p className="text-[#666666]">
                {desexp2}
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{titreexp3}</h4>
                  
                </div>
                <p className="text-[#666666]">{desexp3}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Adresse</h3>
            <p className="text-[#666666]">
              {address}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Disponibilité</h3>
            <p className="text-[#666666]">
              {disponibilite}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Admissions au barreau</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[#666666]">{lieubarreau}</p>
                <div className="text-[#666666] text-sm">{datebarreau}</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Dernières décisions</h3>
            <p className="text-[#666666] text-sm">Decision 1: {selectedDecisions.decision1 ? selectedDecisions.decision1.label : 'None'}</p>
                <p className="text-[#666666] text-sm">Decision 2: {selectedDecisions.decision2 ? selectedDecisions.decision2.label : 'None'}</p>
                <p className="text-[#666666] text-sm">Decision 3: {selectedDecisions.decision3 ? selectedDecisions.decision3.label : 'None'}</p>
            <div className="grid gap-4">
      
    </div>
            <div className="grid gap-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 p-6 w-full md:w-3/5">
      <h1 className="text-2xl font-bold mb-4 text-green-500">Créez votre profil d'expert</h1>
      <form className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4" onSubmit={handleSaveChanges}>
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
            placeholder="votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
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
            placeholder="Votre titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
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
            className="bg-gray-200 cursor-not-allowed flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-500 focus:border-gray-500 focus:ring-gray-500"
            id="email"
            placeholder="votre email"
            value={email}
            type="email"
            readOnly
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="specialties"
          >
            Domaine d'expertise
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
                  value={titreexp1}
                  onChange={(e) => setTitreExp1(e.target.value)}
                />
                
              </div>
              <textarea
                className="flex min-h-[80px] w-full rounded-mtext-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                id="experience-description"
                rows="3"
                placeholder="Description des missions"
                value={desexp1}
                onChange={(e) => setDesExp1(e.target.value)}
              ></textarea>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                  id="experience-title"
                  placeholder="Titre du poste"
                  value={titreexp2}
                  onChange={(e) => setTitreExp2(e.target.value)}
                />
                
              </div>
              <textarea
                className="flex min-h-[80px] w-full rounded-mtext-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                id="experience-description"
                rows="3"
                placeholder="Description des missions"
                value={desexp2}
                onChange={(e) => setDesExp2(e.target.value)}
              ></textarea>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                  id="experience-title"
                  placeholder="Titre du poste"
                  value={titreexp3}
                  onChange={(e) => setTitreExp3(e.target.value)}
                />
                {/* <div className="grid gap-1 sm:flex sm:items-center sm:gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-start"
                    placeholder="Début"
                    type="number"
                  />
                  <span className="text-[#666666]">-</span>
                  <input
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                    id="experience-end"
                    placeholder="Fin"
                    type="number"
                  />
                </div> */}
              </div>
              <textarea
                className="flex min-h-[80px] w-full rounded-mtext-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
                id="experience-description"
                rows="3"
                placeholder="Description des missions"
                value={desexp3}
                onChange={(e) => setDesExp3(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        
        <div>
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
              for="bar-admission-location"
            >
              Lieu d'admission (barreau)
            </label>
            <input
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              id="bar-admission-location"
              placeholder="Californie"
              value={lieubarreau}
              onChange={(e) => setLieuBarreau(e.target.value)}
            />
          </div>
          <div>
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
              for="bar-admission-number"
            >
              Date d'admission (barreau)
            </label>
            <input
              class="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              id="bar-admission-number"
              placeholder="2010"
              type="date"
              value={datebarreau}
              onChange={(e) => setDateBarreau(e.target.value)}
            />
          </div>
          <div className='col-span-1 md:col-span-2 flex flex-col gap-4'>
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
              for="bar-admission-location"
            >
              Adresse
            </label>
            <input
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0  file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-500 focus:border-gray-500 focus:ring-gray-500"
              id="bar-admission-location"
              placeholder="Californie"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          <h3 class="text-green-500 font-medium">Dernières décisions</h3>
          <div class="grid gap-2">
          <label>
                Decision 1:
                <Select
                    name="decision1"
                    value={selectedDecisions.decision1}
                    onChange={(option) => handleSelectChange(option, 'decision1')}
                    options={decisions}
                    placeholder="Select a decision"
                    isSearchable
                />
            </label>
            <br />
            <label>
                Decision 2:
                <Select
                    name="decision2"
                    value={selectedDecisions.decision2}
                    onChange={(option) => handleSelectChange(option, 'decision2')}
                    options={decisions}
                    placeholder="Select a decision"
                    isSearchable
                />
            </label>
            <br />
            <label>
                Decision 3:
                <Select
                    name="decision3"
                    value={selectedDecisions.decision3}
                    onChange={(option) => handleSelectChange(option, 'decision3')}
                    options={decisions}
                    placeholder="Select a decision"
                    isSearchable
                />
            </label>
          {/* {selectedDecisions.map((selectedDecision, index) => (
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
      ))} */}
          </div>
          </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-green-500"
            for="accolades"
          >
            Disponibilité
          </label>
              <Textarea
                id="accolades"
                rows={3}
                placeholder="de 8h à 18h"
                className
                value={disponibilite}
                onChange={(e) => setDisponibilite(e.target.value)}
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