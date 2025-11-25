import React from "react";

const Navbar = () => {
  return (
    <div className="h-16 bg-white px-8 shadow flex items-center justify-between w-full">
      <h3 className="text-lg font-semibold">Welcome User</h3>
      
      <button className="text-sm text-blue-600 font-medium"
        onClick={() => {
          localStorage.removeItem("userRole");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
