import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from './../assets/logo.png';
import Cookies from 'js-cookie';

const DropdownMenu = ({ title, links }) => {
  return (
    <div className="flex items-center justify-center bg-transparent relative text-left">
      <div className="relative cursor-pointer flex items-center justify-between bg-transparent group">
        <NavLink to="#" className="menu-hover text-base text-white mx-2">
          {title}
        </NavLink>
        <span>
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
          </svg>
        </span>
        <div className="top-[20px] z-20 absolute left-0 w-max mt-1 bg-white divide-y divide-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
          <div className="py-[20px]">
            {links.map((link, index) => (
              <NavLink key={index} to={link.to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Nav = () => {
  const [openNav, setOpenNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    Cookies.remove('token');
    Cookies.remove('userName');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const navItems = [
    {
      title: 'Plateforme',
      links: [
        { label: 'Fonctionnalités', to: 'fonctionnalites' },
        { label: 'Pourquoi nous ?', to: 'pourquoi-nous' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: "Cabinets d'avocats", to: 'cabinets-avocats' },
        { label: "Directions d'entreprises", to: 'directions-entreprises' },
        { label: "Directions juridiques du secteur public", to: 'directions-juridiques-du-secteur-public' },
        { label: "Directions sinistres", to: 'directions-sinistres' },
      ],
    },
    {
      title: 'Vie de la communauté',
      links: [
        { label: 'Webinaires', to: 'webinaires' },
        { label: 'Mini-séries', to: 'mini-series' },
        { label: 'Blog', to: 'blog' },
        { label: 'F.A.Q', to: 'faqs' },
      ],
    },
  ];

  return (
    <header className="bg-gradient-to-r from-black to-slate-900 dark:bg-slate-900">
      <div className="z-20 container mx-auto py-4 px-4 xl:flex xl:items-center xl:justify-between">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-semibold flex items-center space-x-2 z-20">
            <img src={logo} alt="" className="rounded-full w-[75px] inline-block items-center" />
            <span className="text-white">ALT</span>
          </NavLink>
          <button
            onClick={toggleNav}
            className="z-50 block xl:hidden border border-gray-600 p-2 rounded text-gray-600 hover:bg-gray-200 focus:outline-none focus:bg-gray-300"
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

        <nav className="text-white hidden xl:flex space-x-12">
          {navItems.map((item, index) => (
            <DropdownMenu key={index} title={item.title} links={item.links} />
          ))}
          <NavLink to="avis-clients" className={({ isActive }) => (isActive ? 'text-cyan-300' : '')}>
            Avis Clients
          </NavLink>
          <NavLink to="tarifs" className={({ isActive }) => (isActive ? 'text-cyan-300' : '')}>
            Tarifs
          </NavLink>
        </nav>

        <div
          className={`${openNav ? '' : 'hidden'} text-white items-center justify-center rounded-2xl mx-10 mt-4 z-50 bg-gradient-to-l from-black to-slate-950 flex flex-col gap-4 p-6 xl:hidden`}
        >
          {navItems.map((item, index) => (
            <DropdownMenu key={index} title={item.title} links={item.links} />
          ))}
          <NavLink to="avis-clients" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
            Avis Clients
          </NavLink>
          <NavLink to="tarifs" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
            Tarifs
          </NavLink>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-green-600 text-white py-2 px-4 transition-all duration-300 rounded hover:bg-gray-600">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/authform?tab=login" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                Connexion
              </Link>
              <Link to="/authform?tab=register" className="block px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-gray-600">
                Inscription
              </Link>
            </>
          )}
        </div>

        <div className="space-x-4 hidden xl:block">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-base text-white mx-2">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-green-600 text-white py-2 px-4 transition-all duration-300 rounded hover:bg-gray-600">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/authform?tab=login" className="text-base text-white mx-2">
                Connexion
              </Link>
              <Link to="/authform?tab=register" className="bg-green-600 text-white py-2 px-4 transition-all duration-300 rounded hover:bg-gray-600">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
