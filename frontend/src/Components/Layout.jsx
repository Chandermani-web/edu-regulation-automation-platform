// Layout.jsx
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="flex flex-col w-full">
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
