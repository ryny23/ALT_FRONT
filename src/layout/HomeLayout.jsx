import { Outlet } from 'react-router-dom'
import React from 'react'
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'

const HomeLayout = () => {
  return (
    <div>
        <Nav />
        <main>
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default HomeLayout