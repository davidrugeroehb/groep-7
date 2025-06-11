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
    <aside id="sidebar">
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
          <Link to="/speeddates"><BsLightningChargeFill className="icoon" /> Speeddates</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/studenten"><BsPeopleFill className="icoon" /> Studenten</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/bedrijven"><BsMenuButtonWideFill className="icoon" /> Bedrijven</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/instellingen"><BsFillGearFill className="icoon" /> Instellingen</Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar