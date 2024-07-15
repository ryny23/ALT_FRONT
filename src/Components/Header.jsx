import React, { useState } from 'react'
import logo from './../assets/logo.png'
import {
    HiMagnifyingGlass,
    } from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi";
import HeaderItem from './HeaderItem';
import { MdAccountBalance, MdGroups } from "react-icons/md";
import { IoLogInSharp } from "react-icons/io5";
import { GiTrophy } from "react-icons/gi";
import { TbCoins } from "react-icons/tb";

function Header() {
    const [toggle,setToggle]=useState(false);
    const menu=[
        { name:'Plateforme', icon:MdAccountBalance },
        { name:'Solutions', icon:HiMagnifyingGlass },
        { name:'Vie de la Communauté', icon:MdGroups },
        { name:'Avis Clients', icon:GiTrophy },
        { name:'Tarifs', icon:TbCoins },
        { name:'Connexion', icon:IoLogInSharp }
    ]
  return (
    <div className=' mx-auto flex items-center justify-between p-2'>
        <div className='flex gap-8 items-center'>
            <img src={logo} className='mx-auto w-[60px] lg:[80px] md:w-[80px] object-cover' />
            <div className='mx-20 hidden md:flex gap-10'>
        {menu.map((item)=>( <HeaderItem name={item.name} Icon={item.icon} /> ))}
        </div>
        <div className='flex md:hidden gap-10'>{menu.map((item,index)=>index<3&&(<HeaderItem name={''} Icon={item.icon} />))}
        
        <div className='md:hidden' onClick={()=>setToggle(!toggle)}>       
            <HeaderItem name={''} Icon={HiDotsVertical} />{toggle? <div className=' bg-white absolute mt-3 border-[1px] border-gray-700 p-3 px-5 py-4'>
            {menu.map((item,index)=>index>2&&(<HeaderItem name={item.name} Icon={item.icon} />  ))}
            </div>:null}
            </div> 
        </div>
        </div>
        
        <button type="button" class="focus:outline-none text-white bg-brandPrimary hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
Inscription
</button>
    </div>
  );
};

export default Header