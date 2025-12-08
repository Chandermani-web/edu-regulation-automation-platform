import React from 'react'
import AICTESidebar from './AICTESidebar.jsx'

const AICTELayout = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AICTESidebar />
      <div className="flex flex-col w-full">
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AICTELayout
