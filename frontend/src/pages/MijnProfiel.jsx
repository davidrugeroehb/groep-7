import React, { useState } from 'react'

function MijnProfiel() {

const[gebruikersData, setgebruikersData] = useState({
  naam: "naam vanuit de database",
  email: "email",
  adres: "adres",
  Opleiding: "opleiding",
  Zoekend: "zoek naar job",
  Taal: "Taal",
})

const[wijzig, setWijzig] = useState(false)

const inputStyle = 'bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all';


  return (
  

      <div className='max-w-lg flex-col gap-2 text-sm'>
        <p className='font-medium text-3xl text-neutral-800 mt-4'>Contact Informatie</p>
      
      <hr className='bg-zinc-400 h-[1px] border-none' />
      <br />
      <br />

      {/* De gegevens worden op de pagina weer gegeven en wordenn in een input veld veranderd als er op bewerken wordt gedrukt */}

        {/* naam */}
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
        <p className='font-medium'>Naam: </p>
      {
        wijzig ? <input type="text" className={inputStyle} value={gebruikersData.naam} onChange={e => setgebruikersData(prev => ({...prev,naam : e.target.value}))} /> 
        : <p className='font-medium'>{gebruikersData.naam}</p>
      }
      
      </div>

      {/* email */}
      <br />

      <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
      <p className='font-medium'>Email: </p>
      {
        wijzig ? <input type="text" className={inputStyle} value={gebruikersData.email} onChange={e => setgebruikersData(prev => ({...prev,email : e.target.value}))} /> 
        : <p className='text-blue-400 font-medium'>{gebruikersData.email}</p>
      }
      </div>
      
        {/* adres */}
        <br />

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
        <p className='font-medium'>Adres: </p>
       {
        wijzig ? <input type="text" className={inputStyle} value={gebruikersData.adres} onChange={e => setgebruikersData(prev => ({...prev,adres : e.target.value}))} /> 
        : <p className='font-medium'>{gebruikersData.adres}</p>
       }
       </div>
       

          {/* Opleiding */}
          <br />

          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Opleiding: </p>
       {
        wijzig ? <input type="text" className={inputStyle} value={gebruikersData.Opleiding} onChange={e => setgebruikersData(prev => ({...prev,Opleiding : e.target.value}))} /> 
        : <p className='font-medium'>{gebruikersData.Opleiding}</p>
       }
       </div>
      
      
         {/* Zoeken */}
         <br />

         <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
         <p className='font-medium'>Zoekt naar: </p>
       {
        wijzig ? <input type="text" className={inputStyle} value={gebruikersData.Zoekend} onChange={e => setgebruikersData(prev => ({...prev,Zoekend : e.target.value}))} /> 
        : <p className='font-medium'>{gebruikersData.Zoekend}</p>
       }
       </div>
    

        {/* Taal */}
        <br />
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
        <p className='font-medium'>Talen: </p>
       {
        wijzig ? <input type="text" className={inputStyle} value={gebruikersData.Taal} onChange={e => setgebruikersData(prev => ({...prev,Taal : e.target.value}))} /> 
        : <p className='font-medium'>{gebruikersData.Taal}</p>
       }
       </div>

       <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
        {
          wijzig ? <button onClick={() => setWijzig(false)}>Gegevens Opslaan</button> : <button onClick={() => setWijzig(true)}>Bewerk</button>
        }
       </div>
        
        
      </div>

    

    
  )
}

export default MijnProfiel
