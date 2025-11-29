import React, { useState } from "react";
import {
  Menu,
  Bell,
  HelpCircle,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full h-16 bg-white shadow flex items-center px-6 justify-between">
      {/* ---------- Left Side: Sidebar Toggle + Search ---------- */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={26} />
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ---------- Right Side: Icons + Profile Menu ---------- */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative hover:bg-gray-100 p-2 rounded-full">
          <Bell size={22} className="text-gray-700" />
          {/* Notification count */}
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* Help / Support */}
        <button className="hover:bg-gray-100 p-2 rounded-full">
          <HelpCircle size={22} className="text-gray-700" />
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition"
          >
            <User size={22} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-xl border rounded-lg w-44 z-50">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left">
                <User size={18} /> My Profile
              </button>

              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left">
                <Settings size={18} /> Change Password
              </button>

              <div className="border-t"></div>

              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
