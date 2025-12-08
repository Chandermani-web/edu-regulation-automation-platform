// Layout.jsx
import React from "react";
import Sidebar from "./Sidebar.jsx";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
