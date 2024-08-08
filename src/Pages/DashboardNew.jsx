import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { NavLink, Outlet } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Logic to handle search submission
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className=''>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 justify-between">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="logo-sidebar" 
                type="button" 
                className="border border-gray-400 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <NavLink to="/" className="flex ms-2 md:me-24">
                <img src={logo} className="rounded-full h-10 w-10 me-3" alt=" Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Brand</span>
              </NavLink>
              <div className="relative">
                <button
                  onClick={handleSearchToggle}
                  className="rounded-full md:hidden border border-gray-200 p-2 relative items-center bg-white dark:bg-gray-800 z-50"
                >
                  <FaSearch size={17} />
                </button>
                <form
                  onSubmit={handleSearchSubmit}
                  className={`hidden md:flex justify-center object-center items-center ${isSearchVisible ? 'block' : 'hidden'}`}
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-[400px] py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-3xl dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    className="ml-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-white p-2 rounded-full"
                  >
                    <span>
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </span>
                  </button>
                </form>
                {isSearchVisible && (
                  <div className="justify-center items-center absolute right-10 mt-4 w-full md:hidden z-40">
                    <form onSubmit={handleSearchSubmit} className="flex">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="rounded-l-xl py-2 px-4 border border-gray-200 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-gray-800 border border-gray-700 rounded-r-xl text-gray-200 p-2"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-3 ms-3">
                <div className='flex'>
                  <NavLink to='compte'>
                    <button>
                      <img className="w-10 h-10 rounded-full" src={logo} alt="user photo" />
                      <span className="sr-only">Open user menu</span>
                    </button>
                  </NavLink>
                </div>
                <NavLink to='compte' className="flex items-center justify-center bg-transparent relative text-left">
                  <button className="text-gray-900 dark:text-white relative cursor-pointer flex items-center justify-between bg-bg-transparent group">
                    Compte
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      
      <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-300 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink to="acceuil" className="flex items-center py-3 px-4 text-gray-900 rounded-3xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
                <span className="ms-3">Acceuil</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="settings" className="flex items-center py-3 px-4 text-gray-900 rounded-3xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm0 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10-10h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm0 10h-4.286A1.857 1.857 0 0 0 10 11.857v4.286C10 17.169 10.831 18 11.857 18h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                </svg>
                <span className="ms-3">Settings</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">3</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="temoignage" className="flex items-center py-3 px-4 text-gray-900 rounded-3xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.5 2A3.5 3.5 0 0 0 5 5.5V6H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v-.5A3.5 3.5 0 0 0 11.5 2h-3ZM7 5.5a1.5 1.5 0 0 1 3 0V6H7v-.5ZM5 9h10v8H5V9Zm5 1a3 3 0 0 0-3 3 1 1 0 1 0 2 0 1 1 0 1 1 2 0 1 1 0 1 0 2 0 3 3 0 0 0-3-3Z"/>
                </svg>
                <span className="ms-3">Temoignage</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">12</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="flex items-center py-3 px-4 text-gray-900 rounded-3xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h10Zm-3 12H8v2h4v-2Zm2-10H6v8h8V4Z"/>
                </svg>
                <span className="ms-3">Calendar</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="flex items-center py-3 px-4 text-gray-900 rounded-3xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm0 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10-10h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm0 10h-4.286A1.857 1.857 0 0 0 10 11.857v4.286C10 17.169 10.831 18 11.857 18h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                </svg>
                <span className="ms-3">Products</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="#" className="flex items-center py-3 px-4 text-gray-900 rounded-3xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="#" className="flex items-center py-3 px-4 text-gray-900 rounded-3xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
            </NavLink>
         </li>
      </ul>
   </div>
      </aside>
    </div>
  )
}

export default Dashboard