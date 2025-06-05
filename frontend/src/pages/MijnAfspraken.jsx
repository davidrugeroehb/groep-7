import React, { useContext, useState } from 'react';
import { AppContext } from '../App';

function MijnAfspraken() {
  const { bedrijven } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-7">
      {toast && (
        <div className="fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 flex items-center gap-2">
          <span>Afspraak geannuleerd</span>
        </div>
      )}

      <p className='pb-3 mt-12 font-medium text-zinc-700 border-bottom'>
        Bekijk hier je bevestigde afspraken:
      </p>
      <div>
        {bedrijven.slice(0, 2).map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.naam}</p>
              <p>{item.focus}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Tijd & Lokaal:</span> 24, Juni, 2025 | 12:00 - 12:15 | Lokaal 1
              </p>
              <div className='flex gap-2 justify-end'>
                <button
                  onClick={() => setSelectedItem(item)}
                  className='text-sm text-stone-500 px-4 py-2 border rounded hover:bg-orange-300 hover:text-white transition-all duration-300 w-fit'
                >
                  Meer Info
                </button>
                <button
                  onClick={() => {
                    setToast(true);
                    setTimeout(() => setToast(false), 3000);
                  }}
                  className='text-sm text-stone-500 px-4 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300 w-fit'
                >
                  Annuleer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">{selectedItem.naam}</h2>
            <p><strong>Focus:</strong> {selectedItem.focus}</p>
            <p><strong>Afspraak:</strong> 24, Juni, 2025 | 12:00 - 12:15 | Lokaal 1</p>
            <p><strong>Beschrijving:</strong> Beschrijving geschreven door het bedrijf.</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border rounded hover:bg-red-500 hover:text-white transition"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MijnAfspraken;