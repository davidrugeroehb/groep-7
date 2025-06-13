import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function AdminLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`grid grid-rows-[auto_1fr] ${sidebarVisible ? 'grid-cols-[260px_1fr]' : 'grid-cols-[1fr]'} h-screen`}>

      {/* Header */}
      <div className="col-span-2">
        <Header onMenuClick={toggleSidebar} />
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <div className="row-span-1">
          <Sidebar />
        </div>
      )}

      {/* Main */}
      <main className="p-5 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
