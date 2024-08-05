import React from 'react'
import Dashboard from '../Pages/Dashboard'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div>
        <Dashboard />
    <div className='xl:ml-72 xl:mt[75px] p-4'>
        <main>
            <Outlet />
        </main>
    </div>
    </div>
  )
}

export default DashboardLayout