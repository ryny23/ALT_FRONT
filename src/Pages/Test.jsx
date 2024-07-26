import React, { useState, useEffect } from 'react';
import ExpertsProfileSettings from '../Components/ExpertsProfileSettings'
import ExpertsProfile from '../Components/ExpertsProfile'
import RechercheExperts from '../Components/RechercheExperts'
import SearchExperts from '../Components/SearchExperts'
import TermsConditions from './TermsConditions'
import RenderDossiers from '../Components/RenderDossiers'
import RenderAlertes from '../Components/RenderAlertes'
import Loader from '../Components/Loader'


const Test = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setLoading(false);
    }, 950);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }


  return (
    <div>
      {/* <RechercheExperts/> */}
      {/* <ExpertsProfileSettings/> */}
      <div>
        <TermsConditions/>
        <RenderDossiers />
        <RenderAlertes/>
      </div>
    </div>
  )
}

export default Test