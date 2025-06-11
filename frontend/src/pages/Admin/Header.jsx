import React from 'react'
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify} from 'react-icons/bs'

function Header() {
  return (
      <header className='header'>
        <div className='menu-icoon'>
          <BsJustify className='icoon' />

        </div>
        <div className='header-left'>
          <BsSearch className='icoon' />

        </div>
        <div className='header-right'>
          <BsFillBellFill className='icoon' />
          <BsFillEnvelopeFill className='icoon' />
          <BsPersonCircle className='icoon' />

        </div>

      </header>

  )
}

export default Header