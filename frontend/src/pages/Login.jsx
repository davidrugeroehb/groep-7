import React from 'react';

function Login() {
  const [state, setState]= React.useState('Student');
  return (

  <form className='min-h-screen flex flex-col items-center justify-center text-black'>
        <h1 className='text-center text-lg font-semibold mb-6'>Welkom bij Career Match!</h1>

        <div className='bg-gray-200 p-10 rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-4'>
          <img src="../assets/ehb.jpg"alt="Logo van ehb" className='h-20 mb-4'></img>
          <p className='text-2xl font-semibold m-auto'><span>{state}</span> Login</p>
          <div className='w-full'>
            <p>Email</p>
            <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required/>
          </div>
          <div className='w-full'>
            <p>Password</p>
            <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required/>
          </div>
          <button className='bg-primary text-white w-full py-2 rounded-md text-base' >Login</button>
          
          {
            state==='Admin'?(
              <p>Student Login?<span onClick={()=>setState('Student')}>Click here</span></p>
            ):state ==='Student'?(
              <p>Bedrijf Login?<span onClick={()=>setState('Bedrijf')}>Click here</span></p>
            ):(<p>Admin Login?<span onClick={()=>setState('Admin')}>Click here</span></p>)
          }
        </div>
      <div className='flex items-center'>
        <p>Nieuwe {state}?</p>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Sign-up</button>
      </div>
    </form>
  )

}

export default Login;