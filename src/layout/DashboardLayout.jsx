import { Outlet } from 'react-router-dom'
import Dashboard from '../Pages/Dashboard'


const DashboardLayout = () => {
  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text'>
        <Dashboard />
        
        <div className='xl:ml-64 xl:mt-[72px]'>
            <main>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default DashboardLayout