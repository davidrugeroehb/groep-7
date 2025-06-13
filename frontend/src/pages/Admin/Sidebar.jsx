import React from 'react'
import {
  BsShieldLock,
  BsGrid1X2Fill,
  BsLightningChargeFill,
  BsPeopleFill,
  BsMenuButtonWideFill,
  BsInfoCircleFill
} from 'react-icons/bs'
import { Link } from 'react-router-dom'

function Sidebar(props) {
  return (
    <aside
      id="sidebar"
      className="bg-gray-800 text-white p-6 h-full w-full space-y-6"
      {...props}
    >
      {/* Titel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
          <BsShieldLock /> ADMIN
        </div>
        
      </div>

      {/* Navigatie */}
      <ul className="flex flex-col gap-2 text-[13px] font-medium tracking-wide">
        <li>
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition"
          >
            <BsGrid1X2Fill /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/speeddatesbeheer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition"
          >
            <BsLightningChargeFill /> Speeddates
          </Link>
        </li>
        <li>
          <Link
            to="/admin/studentenbeheer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition"
          >
            <BsPeopleFill /> Studenten
          </Link>
        </li>
        <li>
          <Link
            to="/admin/bedrijvenbeheer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition"
          >
            <BsMenuButtonWideFill /> Bedrijven
          </Link>
        </li>
        <li>
          <Link
            to="/admin/instellingen"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition"
          >
            <BsInfoCircleFill /> About
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
