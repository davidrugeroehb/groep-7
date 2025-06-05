import React, { useContext, createContext } from 'react';
import { AppContext } from '../App';



function MijnAfspraken() {
  const { bedrijven } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-7">
      <p className = 'pb-3 mt-12 font-medium text-zinc-700 border-bottom'>Bekijk hier je bevestigde afspraken:</p>
      <div>
        {bedrijven.slice(0, 2).map((item, index) => (
  <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
    <div>
      <img className="w-32 bg-indigo-50" src={item.image} alt="" />
    </div>
    <div className='flex-1 text-sm text-zinc-600'>
      <p className='text-neutral-800 font-semibold'>{item.naam}</p>
      <p>{item.focus}</p>
      <p className= 'text-xs mt-1'>
        <span className='text-sm text-neutral-700 font-medium '>Tijd & Lokaal:</span> 24, June, 2025 | 12:00 - 12:15 | Lokaal 1
      </p>
      <div className='flex justify-end'>
        <button className='text-sm text-stone-500 px-4 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300 w-fit"'>Annuleer</button>
      </div>
    </div>
  </div>
))}
      </div>
    </div>
  );
}

export default MijnAfspraken;
