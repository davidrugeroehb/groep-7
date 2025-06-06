import React,{useState} from 'react'

function MijnAanvragen() {
  const [aanvragen, setAanvragen]=useState([
        {
          id: 1,
          bedrijf: 'ByteForge - IT Consultancy',
          focus: 'Software Development Interships',
          tijd: '14:00 - 14:35',
          lokaal: 'K232',
          status:'Bevestigd',
        },
        {
          id: 2,
          bedrijf: 'Cloudify - SaaS Platform Development',
          focus: 'Frontend & devOps Internships',
          tijd: '14:00 - 14:35',
          lokaal: 'A1',
          status:'In afwachting',
        }
      ]);
      function annuleer(id) {
        setAanvragen(aanvragen.filter((aanvraag)=>aanvraag.id !==id));
      };
  return (
    <div>
      <div className='p-4'>
        <h1 className='text-2xl font-semibold'>Mijn aanvragen</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {aanvragen.map((aanvraag)=>(
            <div key={aanvraag.id} className='bg-gray-500 p-4 rounded-md shadow-md flex flex-col gap-3'>
              <p className='font-semibold'><span className='font-bold'>Bedrijf: </span>{aanvraag.bedrijf}</p>
              <p><span className='font-bold'>Focus: </span>{aanvraag.focus}</p>
              <p><span className='font-bold'>Tijdstip: </span>{aanvraag.tijd}</p>
              <p><span className='font-bold'>Lokaal: </span>{aanvraag.lokaal}</p>

              <div className='flex gap-3 mt-2'>
                <button onClick={()=> annuleer(aanvraag.id)} className='bg-red-500 text-white px-3 py-1 rounded text-sm'>Annuleren</button>
                {aanvraag.status==='Bevestigd'?(
                  <span className='bg-green-500 text-white px-3 py-1 rounded text-sm'>Bevestigd</span>
                  ):(
                    <span className='bg-yellow-400 text-white px-3 py-1 rounded text-sm'>In afwachting</span>
                  )
                }
              </div>
            </div>
          ))
          }
        </div>

      </div>
    </div>
  )
}

export default MijnAanvragen