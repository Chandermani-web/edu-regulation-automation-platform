import React, { useState } from "react";
import { Bell, HelpCircle, Search, ChevronDown, User, Key, LogOut } from "lucide-react";

const UGCNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* ---------- Left: Search Bar ---------- */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3">
        <Search className="text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search applications, institutes..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </div>

      {/* ---------- Right Section ---------- */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell size={22} className="text-slate-700" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        {/* Help */}
        <div className="flex items-center gap-1 cursor-pointer text-slate-700 hover:text-blue-700">
          <HelpCircle size={21} />
          <span className="text-sm font-medium hidden md:block">Help</span>
        </div>

        {/* ---------- Profile Dropdown ---------- */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200"
          >
            <img
              src="https://ui-avatars.com/api/?name=UGC+Officer"
              alt="profile"
              className="w-8 h-8 rounded-full border"
            />
            <span className="font-medium text-sm">UGC Officer</span>
            <ChevronDown size={18} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg py-2 z-50">

              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 w-full">
                <User size={18} /> My Profile
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 w-full">
                <Key size={18} /> Change Password
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full">
                <LogOut size={18} /> Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UGCNavbar;
