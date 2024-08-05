import React from 'react'
import PricingCard from '../Components/PricingCard'
import CTA3 from '../Components/CTA3'
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'

const Tarifs = () => {
  return (
    <div>
      <div>
        <h1 className='text-3xl font-semibold text-center mt-8'>Tarifs</h1>
        <PricingCard/>
      <CTA3/>
      </div>
    </div>
  )
}

export default Tarifs