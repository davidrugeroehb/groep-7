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

// Ontvang 'props' als argument van de functie
function Sidebar(props) {
  return (
    // Voeg props toe aan de aside tag.
    <aside id="sidebar" className='area-sidebar'{...props}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsShieldLock className="icoon_header" /> ADMIN
        </div>
        <span className="icoon close_icon">X</span>
      </div>
      <ul className="sidebar-list">
        {/* Pas de Link 'to' paden aan om overeen te komen met de geneste admin routes */}
        {/* Bijvoorbeeld, van "/" naar "/admin/dashboard" */}
        <li className="sidebar-list-item">
          <Link to="/admin/dashboard"><BsGrid1X2Fill className="icoon" /> Dashboard</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/speeddatesbeheer"><BsLightningChargeFill className="icoon" /> Speeddates</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/studentenbeheer"><BsPeopleFill className="icoon" /> Studenten</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/bedrijvenbeheer"><BsMenuButtonWideFill className="icoon" /> Bedrijven</Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/admin/instellingen"><BsFillGearFill className="icoon" /> Instellingen</Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
