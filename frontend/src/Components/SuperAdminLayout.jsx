import React from 'react'
import SuperAdminSidebar from './SuperAdminSidebar'

const SuperAdminLayout = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SuperAdminSidebar />
      <div className="flex flex-col w-full">
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminLayout
