import React from 'react'
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify} from 'react-icons/bs'

// Ontvang 'props' als argument van de functie
function Header(props) {
  return (
      // Voeg props toe aan de header tag. Je kunt ook specifieke props destructuren als je weet welke je verwacht.
      // Voor dit voorbeeld, als er geen specifieke props nodig zijn, kun je `...props` weghalen
      // of de functie definiëren als `function Header({})` als je geen props verwacht.
      // Maar als 'area-sidebar' een prop is, moet het zo:
      <header className='area-sidebar' {...props}>
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
