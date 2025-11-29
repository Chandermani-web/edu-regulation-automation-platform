// Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showNavbar = false }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex flex-col w-full">

        {/* Show navbar only if enable */}
        {showNavbar && <Navbar />}

        <div className="p-10">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;
