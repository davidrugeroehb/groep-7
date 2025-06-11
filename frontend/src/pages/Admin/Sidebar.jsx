import React from 'react'
import {
  BsShieldLock,
  BsGrid1X2Fill,
  BsLightningChargeFill,
  BsPeopleFill,
  BsMenuButtonWideFill,
  BsFillGearFill
} from 'react-icons/bs'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside id="sidebar" className='area-sidebar'{...props}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsShieldLock className="icoon_header" /> ADMIN
        </div>
        <span className="icoon close_icon">X</span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/"><BsGrid1X2Fill className="icoon" /> Dashboard</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adspeeddate"><BsLightningChargeFill className="icoon" /> Speeddates</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adstudenten"><BsPeopleFill className="icoon" /> Studenten</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adbedrijven"><BsMenuButtonWideFill className="icoon" /> Bedrijven</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adinstellingen"><BsFillGearFill className="icoon" /> Instellingen</Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar