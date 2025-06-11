import React from 'react'
import {BsShieldLock, BsGrid1X2Fill, BsLightningChargeFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsCheckCircleFill, BsFillGearFill } from 'react-icons/bs'

function Home() {
  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>
          DASHBOARD 
        </h3>
      </div>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
          <h3>SPEEDDATES</h3>
          <BsLightningChargeFill className='card-icoon' />
          </div>
          <h1>300</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
          <h3>STUDENTEN</h3>
          <BsPeopleFill className='card-icoon' />
          </div>
          <h1>500</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
          <h3>BEDRIJVEN</h3>
          <BsMenuButtonWideFill className='card-icoon' />
          </div>
          <h1>30</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
          <h3>ALERTS</h3>
          <BsCheckCircleFill className='card-icoon' />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className='charts'></div>
    </main>
  )
}

export default Home