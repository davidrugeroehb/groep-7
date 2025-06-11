import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId'); // Controleer ook of de gebruiker überhaupt een ID heeft opgeslagen

  // 1. Controleer of de gebruiker is ingelogd (heeft een userId en een rol)
  if (!userId || !userRole) {
    console.log("ProtectRoute: Geen userId of rol gevonden, omleiden naar login.");
    return <Navigate to="/login" replace />; // Stuur naar de loginpagina
  }

  // 2. Controleer of de rol van de gebruiker is toegestaan voor deze route
  // Gebruik de 'userRole' die we uit localStorage hebben gehaald
  if (allowedRoles && allowedRoles.includes(userRole)) {
    console.log(`ProtectRoute: Rol "${userRole}" is toegestaan voor deze route (vereist: ${allowedRoles}). Toegang verleend.`);
    return <Outlet />; // Render de child component (bijv. AdminLayout met Dashboard)
  } else {
    // 3. Rol is niet toegestaan, omleiden naar een algemene pagina
    console.warn(`ProtectRoute: Rol "${userRole}" is NIET toegestaan voor deze route (vereist: ${allowedRoles}). Omleiden.`);
    // Stuur ongeautoriseerde gebruikers naar de algemene speeddates pagina
    return <Navigate to="/speeddates" replace />;
  }
};

export default ProtectRoute;
