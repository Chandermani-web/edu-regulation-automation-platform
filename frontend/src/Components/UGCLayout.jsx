import React from "react";
import UGCSidebar from "./UGCSidebar";
import UGCNavbar from "./UGCNavbar";

const UGCLayout = ({ children, showNavbar = false }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* -------- LEFT SIDEBAR -------- */}
      <UGCSidebar />

      {/* -------- MAIN AREA -------- */}
      <div className="flex flex-col w-full">

        {/* -------- TOP NAVBAR (optional) -------- */}
        {showNavbar && <UGCNavbar />}

        {/* -------- PAGE CONTENT -------- */}
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
};

export default UGCLayout;
