import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function AdminLayout({ children }) {
  return (
    <div
      className="
        grid 
        grid-cols-[260px_1fr_1fr_1fr] 
        grid-rows-[0.2fr_3fr] 
        grid-areas-[sidebar_header_header_header_sidebar_main_main_main]
        h-screen
      "
    >
      <Header className="area-header" />
      <Sidebar className="area-sidebar" />
      <main className="area-main">
        {children}
      </main>
    </div>
  );
}


export default AdminLayout;
