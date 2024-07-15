import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { Link, ScrollLink } from 'react-scroll';
import { FaXmark, FaBars } from 'react-icons/fa6';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

//Set toggle Menu
const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
};

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY < 100){
                setIsSticky(true);
            }
            else{
                setIsSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.addEventListener('scroll', handleScroll);
        }
    });
    
    //Nav items array
    const navItems = [
        {link: "Acceuil", path: "acceuil"},
        {link: "Plateforme", path: "plateforme"},
        {link: "Solution", path: "solution"},
        {link: "Vie de la communauté", path: "vie de la communauté"},
        {link: "Avis Clients", path: "avis clients"},
        {link: "Tarifs", path: "tarifs"},
    ];
    
  return (
    <header className='w-full bg-white md:bg-transparent top-0 left-0 right-0'>
        <nav className={`py-4 lg:px-14 px-4 ${isSticky ? "sticky top-0 left-0 right-0 border-b bg-white duration-300" : ""}`}>
            <div className='flex justify-between items-center text-base gap-8'>
                <a href="" className='text-2*1 font-semibold flex items-center space-x-2'><img src={logo} alt="" className='w-[75px] inline-block items-center'/><span className='text-[#263228]'>ALT</span></a>
        
                    {/*nav item for large screens*/}
                    <ul className='md:flex space-x-12 hidden'>
                    {navItems.map(({link, path}) => <Link to={path} spy={true} smooth={true} offset={-180} key={path} className=' cursor-pointer block text-base text-gray900 hover:text-bandPrimary first:font-medium'>{link}</Link> )}
                    <a href=""></a>
                   </ul>

                    {/*btn for large screens*/}
                   <div className='space-x-12 hidden lg:flex items-center'>
                    <a href="" className='hidden lg:flex items-center text-brandPrimary hover:text-gray900'>Connexion</a>
                    <button className='bg-brandPrimary text-white py-2 px-4 transition-all duration-300 rounded hover:bg-neutralDGrey'>Inscription</button>

                   </div>
                    {/*Menu btn for only large screens*/}
                    <div className='md:hidden lg:hidden'>
                        <button 
                        onClick={toggleMenu}
                        className='text-neutralDGrey focus:outline-none focus:text-gray-500'>
                            {
                                isMenuOpen ? (<FaXmark className='h-6 w-6'/>) : (<FaBars className='h-6 w-6'/>) 
                            }
                        </button>
                    </div>
            </div>

            {/*nav item for mobile device */}
            <div className={`space-y-4 px-4 mt-16 py-7 bg-brandPrimary right-0 top-0 bottom-0 ${ isMenuOpen ? " flex-col w-[50vw] z-40 h-[70vh] p-20 gap-10 block fixed top-0 right-0 left-0" : "hidden"}`}>
            {navItems.map(({link, path}) => <Link to={path} spy={true} smooth={true} offset={-180} key={path} className='block text-base text-white hover:text-bandPrimary first:font-medium'>{link}</Link> )}
            </div>
        </nav>

    </header>
  );

};




export default Navbar;