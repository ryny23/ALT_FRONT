import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import anime from '../assets/anime.svg';
import logo from './../assets/logo.png';
import { Button } from 'flowbite-react';
import { Option } from '@material-tailwind/react';
import Select from 'react-select';
import Nav from './Nav';
import Footer from './Footer';

const ExpertsProfile = () => {
  const { userId } = useParams();

  const [decisions, setDecisions] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState({
    decision1: null,
    decision2: null,
    decision3: null
  });

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

  const [selectedDomains, setSelectedDomains] = useState([]);

  
  const [state, setState] = useState({
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
  }, [userId]);

  const { loading } = state;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={anime} alt="Loading" />
      </div>
    );
  }

  return (
    <div>
      <Nav/>
      <div className="flex flex-col min-h-screen bg-white">
    <div className="flex-1 flex justify-center items-center">
    <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <span className="relative flex shrink-0 overflow-hidden rounded-full w-20 h-20">
          <img src={avatarUrl || "https://placehold.co/96x96"} alt="Avatar" className="rounded-full" />
          </span>
          
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">{nom}</h2>
          <p className="text-[#666666]">{titre}</p>
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
              <span className="text-[#666666]">{phone}</span>
            </div>
            {/* <div className="flex items-center justify-center md:justify-start">
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
            </div> */}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Spécialités</h3>
        
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
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Expérience</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{titreexp1}</h4>
              
            </div>
            <p className="text-[#666666]">
              {desexp1}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{titreexp2}</h4>
              
            </div>
            <p className="text-[#666666]">{desexp2}</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{titreexp3}</h4>
        
            </div>
            <p className="text-[#666666]">{desexp3}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Adresse</h3>
        <p className="text-[#666666]">
          {address}
        </p>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Disponibilité</h3>
        <p className="text-[#666666]">
          {disponibilite}
        </p>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Admissions au barreau</h3>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[#666666]">{lieubarreau}</p>
            <div className="text-[#666666] text-sm">{datebarreau}</div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-1">Dernieres decisions</h3>
        <p className="text-[#666666] text-sm">Decision 1: {selectedDecisions.decision1 ? selectedDecisions.decision1.label : 'None'}</p>
                <p className="text-[#666666] text-sm">Decision 2: {selectedDecisions.decision2 ? selectedDecisions.decision2.label : 'None'}</p>
                <p className="text-[#666666] text-sm">Decision 3: {selectedDecisions.decision3 ? selectedDecisions.decision3.label : 'None'}</p>
      </div>
    </div>
  </div>
</div>
        <Footer/>
    </div>
  )
};

export default ExpertsProfile;
