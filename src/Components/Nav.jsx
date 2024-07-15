import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from './../assets/logo.png';
import Cookies from 'js-cookie';

const Nav = () => {
  const [openNav, setOpenNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifiez si le token est présent dans le local storage ou les cookies
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleLogout = () => {
    // Supprimer le token du local storage et des cookies
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    Cookies.remove('token');
    Cookies.remove('userName');
    setIsLoggedIn(false);
    // Rediriger vers la page d'accueil
    window.location.href = '/';
  };

  const navList = () => {
    return (
      <div className='text-left flex flex-col md:flex-row justify-between items-center text-base gap-10 z-20 font-Inter'>
        <div className="flex items-center justify-center bg-transparent relative text-left">
          <div className="relative cursor-pointer flex items-center justify-between bg-bg-transparent group">
            <NavLink to="#" className="text-white menu-hover text-base white mx-2">
              Plateforme
            </NavLink>
            <span>
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
              </svg>
            </span>
            <div className="top-[20px] z-20 absolute left-0 w-[150px] mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
              <div className="py-[20px]">
                <NavLink to="/fonctionnalites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Fonctionnalités</NavLink>
                <NavLink to="/pourquoi-nous" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pourquoi nous ?</NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-transparent relative text-left">
          <div className="relative cursor-pointer flex items-center justify-between bg-bg-transparent group">
            <NavLink to="#" className="menu-hover text-base text-white mx-2">
              Solutions
            </NavLink>
            <span>
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
              </svg>
            </span>
            <div className="top-[20px] z-20 absolute left-0 w-[270px] mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
              <div className="py-[20px]">
                <NavLink to="/cabinets-avocats" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cabinets d'avocats</NavLink>
                <NavLink to="/directions-entreprises" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Directions d'entreprises</NavLink>
                <NavLink to="/directions-juridiques-du-secteur-public" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Directions juridiques du secteur public</NavLink>
                <NavLink to="/directions-sinistres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Directions sinistres</NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-transparent relative text-left">
          <div className="relative cursor-pointer flex items-center justify-between bg-bg-transparent group">
            <NavLink to="#" className="menu-hover text-base text-white mx-2">
              Vie de la communauté
            </NavLink>
            <span>
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
              </svg>
            </span>
            <div className="top-[20px] z-20 absolute left-0 w-[180px] mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
              <div className="py-[20px]">
                <NavLink to="/webinaires" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Webinaires</NavLink>
                <NavLink to="/mini-series" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mini-séries</NavLink>
                <NavLink to="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Blog</NavLink>
                <NavLink to="/faqs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">F.A.Q</NavLink>
              </div>
            </div>
          </div>
        </div>
        <NavLink
          to="/avis-clients"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "text-cyan-300" : ""
          }
        >
          Avis Clients
        </NavLink>
        <NavLink
          to="/tarifs"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "text-cyan-300" : ""
          }
        >
          Tarifs
        </NavLink>
      </div>
    );
  };

  return (
    <header className="bg-gradient-to-r from-black to-slate-900 dark:bg-slate-900">
      <div className="z-20 container mx-auto py-4 px-4 md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <NavLink to="/" className='text-2xl font-semibold flex items-center space-x-2 z-20'>
            <img src={logo} alt="" className='rounded-full w-[75px] inline-block items-center' /><span className='text-[white]'>ALT</span>
          </NavLink>
          <button
            onClick={toggleNav}
            className="z-50 block md:hidden border border-gray-600 p-2 rounded text-gray-600 hover:bg-gray-200 focus:outline-none focus:bg-gray-300"
          >
            <svg
              className={`w-6 h-6 ${openNav ? 'hidden' : 'block'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
            <svg
              className={`w-6 h-6 ${openNav ? 'block' : 'hidden'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <nav className="text-white hidden md:flex space-x-12">
          {navList()}
        </nav>

        <div
          className={`${openNav ? '' : 'hidden'
            } text-white rounded-2xl mx-10 mt-4 z-50 bg-gradient-to-l from-black to-slate-950 flex flex-col gap-4 p-6 md:hidden`}
        >
          {navList()}
        </div>

        <div className='space-x-12 hidden lg:flex items-center z-20'>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className='text-white hover:text-green-300'>
                <button>
                  Dashboard
                </button>
              </Link>
              <button onClick={handleLogout} className='bg-green-600 text-white py-2 px-4 transition-all duration-300 rounded hover:bg-gray-600'>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/authform?tab=login" className='hidden lg:flex items-center text-white hover:text-green-300'>
                <button>
                  Connexion
                </button>
              </Link>
              <Link to="/authform?tab=register" className='hidden lg:flex items-center text-white hover:text-green-400'>
                <button className='bg-green-600 text-white py-2 px-4 transition-all duration-300 rounded hover:bg-gray-600'>
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Nav;
