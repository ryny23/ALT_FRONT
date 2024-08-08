import React from 'react'
import { Outlet } from 'react-router-dom'
import Details from '../Pages/Details'

const ExpertsLayout = () => {
  return (
    <div className=''>
        <Details />
        
        <div className=''>
            <main>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default ExpertsLayout