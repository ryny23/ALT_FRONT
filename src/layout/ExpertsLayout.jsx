import React from 'react'
import { Outlet } from 'react-router-dom'
import SearchExperts from '../Pages/SearchExperts'
import Dashboard from '../Pages/Dashboard'

const ExpertsLayout = () => {
  return (
    <div>
        <SearchExperts />
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default ExpertsLayout