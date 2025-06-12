import React from 'react'
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify} from 'react-icons/bs'
import logo from '../../assets/fotoehb.png';


function Header({onMenuClick}) {
  return (

      <header className='flex justify-between items-center bg-white p-4 shadow-md'>
        <div className='cursor-pointer' onClick={onMenuClick}>
          <BsJustify className='text-xl' />

        


        </div>
        <div className="flex justify-center flex-1">
          <img src={logo} alt="Logo" className="h-10 object-contain" />
        </div>
        <div className='header-right flex items-center space-x-4'>
          <BsFillBellFill/>
          <BsFillEnvelopeFill/>
          <BsPersonCircle/>

        </div>

      </header>

  )
}

export default Header
