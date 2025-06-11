import React from 'react';
import { Navigate } from 'react-router-dom';
//zorgt dat alleen mensen met rol admin op admin kunnen komen

const ProtectRoute=({allowedRoles,children})=>{
    const role=localStorage.getItem('role');
    return a.includes(role) ? b: <Navigate to="/login" replace/>
}

export default ProtectRoute