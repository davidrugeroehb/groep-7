import React from 'react'
import { 
  BsLightningChargeFill, 
  BsPeopleFill, 
  BsMenuButtonWideFill, 
  BsCheckCircleFill 
} from 'react-icons/bs'

function Dashboard() {
  return (
    <main className="col-span-3 row-span-2 overflow-y-auto p-5 text-black">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">DASHBOARD</h3>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="flex flex-col justify-around p-4 rounded-md bg-red-600 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">SPEEDDATES</h3>
            <BsLightningChargeFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">300</h1>
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-red-400 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">STUDENTEN</h3>
            <BsPeopleFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">500</h1>
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-purple-700 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">BEDRIJVEN</h3>
            <BsMenuButtonWideFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">30</h1>
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-green-600 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">ALERTS</h3>
            <BsCheckCircleFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">42</h1>
        </div>
      </div>

      <div className="charts">
        {/* Plaats hier je charts-componenten */}
      </div>
    </main>
  )
}

export default Dashboard;