import {createContext} from 'react'
import React, { useState, useEffect } from 'react';
export const AdminContext= createContext()
const AdminContextProvider=(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [aToken,setAToken]=useState('')
    const value={
        aToken,setAToken,
        backendUrl
    }

    return (
    <AdminContext.Provider value={value}>
        {props.children}
    </AdminContext.Provider>
    )
}

export default AdminContextProvider