import React from 'react'
import AuthForm from '../Pages/AuthForm'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
    <div>
      <AuthForm />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Authlayout