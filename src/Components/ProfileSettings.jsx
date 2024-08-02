import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import anime from '../assets/anime.svg'

function ProfileSettings() {

  const [selectedProfession, setSelectedProfession] = useState('');
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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarId, setAvatarId] = useState(null);

  const [state, setState] = useState({
    loading: true,
    error: ''
  });
  

  const professions = [
        'Ingénieur',
        'Médécin',
        'Avocat',
        'Enseignant',
        'Designer',
        'Développeur',
        'Architecte',
        'Notaire',
        'Journaliste',
        'Psychologue',
        'Pilote',
        'Infirmier',
        'Entrepreneur',
        'Scientifique'
  ];

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

  const handlePasswordChange = async (event) => {
      event.preventDefault();

      try {
          const token = localStorage.getItem('token');

          const response = await axios.put('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
              password: passwordNew,
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          console.log('Password updated successfully:', response.data);
          setSuccess('Password updated successfully!');

          alert('Password updated successfully!');
          localStorage.removeItem('token');
          window.location.href = '/authform';
      } catch (error) {
          console.error('Error updating password:', error);
          alert('Error updating password. Please try again.');
      }
  };

  const handleSaveChanges = async (event) => {
      event.preventDefault();

      try {
          const token = localStorage.getItem('token');

          const response = await axios.patch('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
              acf: {
                  nom,
                  prenom,
                  tel: phone,
                  profession: selectedProfession,
                  sexe: gender,
                  adresse: address,
                  entreprise: company,
                  date_naissance: birthdate.replace(/-/g, ''),
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
              const userData = response.data;
              setNom(userData.acf.nom);
              setPrenom(userData.acf.prenom);
              setUsername(userData.name);
              setPhone(userData.acf.tel);
              setSelectedProfession(userData.acf.profession);
              setGender(userData.acf.sexe);
              setAddress(userData.acf.adresse);
              setCompany(userData.acf.entreprise);

              const avatarId = userData.acf.avatar;
              if (avatarId) {
                  setAvatarId(avatarId);
                  const avatarResponse = await axios.get(`https://alt.back.qilinsa.com/wp-json/wp/v2/media/${avatarId}`);
                  setAvatarUrl(avatarResponse.data.source_url);
              }

              const birthdateFromApi = userData.acf.date_naissance;
              if (birthdateFromApi) {
                  const year = birthdateFromApi.substr(0, 4);
                  const month = birthdateFromApi.substr(4, 2);
                  const day = birthdateFromApi.substr(6, 2);
                  const formattedBirthdate = `${year}-${month}-${day}`;
                  setBirthdate(formattedBirthdate);
              }
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
          setState({ loading: false, error: '' });
      };

      fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');

        await axios.delete('https://alt.back.qilinsa.com/wp-json/wp/v2/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                reassign: 1,
                force: true,
            },
        });

        alert('Compte supprimé avec succès.');
        localStorage.removeItem('token');
        window.location.href = '/';
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Erreur lors de la suppression du compte. Veuillez réessayer.');
    }
};

  useEffect(() => {
      setPasswordsMatch(passwordNew === passwordConfirm);
  }, [passwordNew, passwordConfirm]);


  const { loading } = state;

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
      //     <span className="visually-hidden">Loading...</span>
      //   </div>
      // </div>
      <div className="flex justify-center items-center h-screen">
      
        <img src={anime}></img>
      
    </div>
    );
  }


  return (
      <div className="text-foreground min-h-screen flex items-center justify-center p-4">
          <div className="grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
              {/* Section: Personal Information */}
              <div className="p-8 rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                  <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                  <p className="text-muted-foreground mb-6">Utilisez une adresse permanente où vous pouvez recevoir du courrier.</p>
                  <div className="flex items-center mb-6">
                      <img className="w-24 h-24 rounded-full mr-4" src={avatarUrl || "https://placehold.co/96x96"} alt="Avatar de l'utilisateur" />
                      <div>
                          <button
                              type="button"
                              className="bg-gray-200 dark:bg-slate-950 text-secondary-foreground hover:bg-gray-300 dark:hover:bg-black px-4 py-2 rounded-lg"
                              onClick={handleAvatarChangeClick}
                          >
                              Changer l'avatar
                          </button>
                          <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: 'none' }}
                              onChange={handleFileChange}
                              accept="image/*"
                          />
                          <p className="text-muted-foreground text-sm mt-1">JPG, GIF ou PNG. 1MB max.</p>
                      </div>
                  </div>
                  <form onSubmit={handleSaveChanges}>
                      
                      <div className="mb-4 ">
                          <label className="block text-sm font-medium mb-1" htmlFor="username">
                              Nom d'utilisateur
                          </label>
                          <input
                              className="bg-gray-200 dark:bg-dark-background text-light-text dark:text-dark-text cursor-not-allowed bg-input border border-border rounded-lg w-full py-2 px-3"
                              type="text"
                              id="username"
                              value={username}
                              
                              readOnly
                          />
                      </div>
                      <div className="mb-4">
                          <label className="block text-sm font-medium mb-1" htmlFor="email">
                              E-mail
                          </label>
                          <input
                              className="bg-gray-200 dark:bg-dark-background text-light-text dark:text-dark-text cursor-not-allowed bg-input border border-border rounded-lg w-full py-2 px-3"
                              type="email"
                              id="email"
                              value={email}
                              readOnly
                          />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text block text-sm font-medium mb-1" htmlFor="first-name">
                                  Prénom
                              </label>
                              <input className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3" type="text" id="first-name" value={prenom} onChange={(e) => setPrenom(e.target.value)}/>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1" htmlFor="last-name">
                                  Nom
                              </label>
                              <input className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3" type="text" id="last-name" value={nom} onChange={(e) => setNom(e.target.value)}/>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1" htmlFor="gender">
                                  Sexe
                              </label>
                            <select className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Sélectionner</option>
                                <option value="Homme">Homme</option>
                                <option value="Femme">Femme</option>
                            </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1" htmlFor="birth-date">
                                  Date d'anniversaire (m-d-y)
                              </label>
                              <input className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3" type="date" id="birth-date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                          </div>
                      </div>
                      <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text block text-sm font-medium mb-1" htmlFor="phone">
                                  Téléphone
                              </label>
                              <input
                                  className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3"
                                  type="text"
                                  id="phone"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                              />
                          </div>
                          <div>
                              <label className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text block text-sm font-medium mb-1" htmlFor="address">
                                  Adresse
                              </label>
                              <input
                                  className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3"
                                  type="text"
                                  id="address"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                              />
                          </div>
                          <div>
                              <label className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text block text-sm font-medium mb-1" htmlFor="company">
                                  Entreprise
                              </label>
                              <input
                                  className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3"
                                  type="text"
                                  id="company"
                                  value={company}
                                  onChange={(e) => setCompany(e.target.value)}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1" htmlFor="profession">
                                  Profession
                              </label>
                              <select 
                                  id="profession"
                                  name="profession"
                                  value={selectedProfession}
                                  onChange={(e) => setSelectedProfession(e.target.value)}
                                  required
                                  className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3"
                              >
                                  <option value="">Sélectionner une profession</option>
                                  {professions.map((profession, index) => (
                                      <option key={index} value={profession}>{profession}</option>
                                  ))}
                              </select>
                          </div>
                      </div>
                      <button className="bg-green-600 text-white hover:bg-blue-500 px-4 py-2 rounded-lg">Enregistrer</button>
                      <p className="text-green-500">{success}</p>
                      <p className="text-red-500">{error}</p>
                  </form>
              </div>

              {/* Section: Change Password */}
              <div className="p-8 rounded-lg bg-bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                  <h2 className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text text-xl font-semibold mb-4">Changer le mot de passe</h2>
                  <form onSubmit={handlePasswordChange}>
                      {/* <div className="mb-4">
                          
                          <label className="block text-sm font-medium mb-1" htmlFor="current-password">
                              Mot de passe actuel
                          </label>
                          <input
                              className="bg-input border border-border rounded-lg w-full py-2 px-3"
                              type="password"
                              id="current-password"
                              value={passwordCurrent}
                              onChange={(e) => setPasswordCurrent(e.target.value)}
                              required
                          />
                      </div> */}
                      <div className="mb-4">
                          <label className="block text-sm font-medium mb-1" htmlFor="new-password">
                              Nouveau mot de passe
                          </label>
                          <input className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3" type="password" id="new-password" value={passwordNew} onChange={(e) => setPasswordNew(e.target.value)} />
                      </div>
                      <div className="mb-4">
                          <label className="block text-sm font-medium mb-1" htmlFor="confirm-new-password">
                              Confirmer le nouveau mot de passe
                          </label>
                          <input className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  border border-border rounded-lg w-full py-2 px-3" type="password" id="confirm-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                      </div>
                      {!passwordsMatch && (
                          <p className="text-red-500 mb-4">Les mots de passe ne correspondent pas.</p>
                      )}
                      <button type="submit" className="bg-green-600 text-white hover:bg-blue-500 px-4 py-2 rounded-lg" disabled={!passwordsMatch}>Changer le mot de passe</button>
                      <p>{error}</p>
                  </form>
              </div>

              {/* Section: Delete Account */}
              <div className="p-8 rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                  <h2 className="text-xl font-semibold mb-4">Supprimer le compte</h2>
                  <p className="mb-6 ">Vous ne souhaitez plus utiliser notre service ? Vous pouvez supprimer votre compte ici. Cette action est irréversible. Toutes les informations liées à ce compte seront définitivement supprimées.</p>
                  <button className="bg-[#f85149] text-white py-2 px-4 rounded-lg hover:bg-[#da3633]" type="button" onClick={handleDeleteAccount}>Oui, supprimer mon compte</button>
              </div>

              <div className="text-light-text dark:text-dark-text text-center p-8 rounded-lg bg-light-background dark:bg-dark-background top-4 md:top-16 h-full">
                  <h2 className="text-xl font-semibold mb-4">Aperçu des informations générales</h2>
                  <p className="text-muted-foreground mb-6">Voici un aperçu de vos informations actuelles :</p>
                  <ul className="text-muted-foreground">
                      <li>Prénom: {prenom || 'non-specifié'}</li>
                      <li>Nom: {nom || 'non-specifié'}</li>
                      <li>Sexe: {gender || 'non-specifié'}</li>
                      <li>Date d'anniversaire: {birthdate || 'non-specifié'}</li>
                      <li>Nom d'utilisateur: {username || 'non-specifié'}</li>
                      <li>E-mail: {email || 'non-specifié'}</li>
                      <li>Téléphone: {phone || 'non-specifié'}</li>
                      <li>Adresse: {address || 'non-specifié'}</li>
                      <li>Entreprise: {company || 'non-specifié'}</li>
                      <li>Profession: {selectedProfession || 'non-specifié'}</li>
                  </ul>
              </div>

          </div>
          
      </div>
  );
}

export default ProfileSettings;
