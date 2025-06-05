import React, { useContext, useState } from 'react';
import { AdminContext } from '../Context/Admincontext';
import axios from 'axios';
import{toast} from 'react-toastify'

function Login() {
  const [state, setState]= React.useState('Student');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const {setAToken, backendUrl}=useContext(AdminContext)
  const onSubmitHandler= async (event)=>{
    event.preventDefault()
    try{
      if(state==='Admin'){
          const{data}=await axios.post(backendUrl+'/api/admin/login',{email,password})
          if(data.succes){
            localStorage.setItem('aToken',data.token)
            console.log(data.token)
            setAToken(data.token)
          }else{
            toast.error(data.message)
          }
      }else{

      }
    }catch(error){

    }
  }

  return (
  <form onSubmit={onSubmitHandler} className='min-h-screen flex flex-col items-center justify-center text-black'>
        <h1 className='text-center text-lg font-semibold mb-6'>Welkom bij Career Match!</h1>

        <div className='bg-gray-200 p-10 rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-4'>
          <img src="../assets/ehb.jpg"alt="Logo van ehb" className='h-20 mb-4'></img>
          <p className='text-2xl font-semibold m-auto'><span>{state}</span> Login</p>
          <div className='w-full'>
            <p>Email</p>
            <input onChange={(e)=>setEmail(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required/>
          </div>
          <div className='w-full'>
            <p>Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required/>
          </div>
          <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md text-base transition'>Login</button>
          
          {
            state==='Admin'?(
              <p>Student Login? <span onClick={()=>setState('Student')} className='text-blue-500 underline'>Click here</span></p>
            ):state ==='Student'?(
              <p>Bedrijf Login? <span onClick={()=>setState('Bedrijf')} className='text-blue-500 underline'>Click here</span></p>
            ):(<p>Admin Login? <span onClick={()=>setState('Admin')} className='text-blue-500 underline'>Click here</span></p>)
          }
        </div>
      <div className='flex items-center'>
        <p>Nieuwe {state}?</p>
        <button className='bg-primary bg-blue-500 text-black w-full py-2 rounded-md text-base'>Sign-up</button>
      </div>
    </form>
  )

}

export default Login;