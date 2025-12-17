import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  Bot,
  User,
  Info,
  LogOut,
  Building2,
  Shield,
  MessageSquare
} from "lucide-react";

export default function InstitutionNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      path: "/institution/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Overview & Analytics"
    },
    {
      path: "/institution/application",
      icon: FileText,
      label: "Applications",
      description: "Manage Submissions"
    },
    // {
    //   path: "/institution/queries-and-review",
    //   icon: ClipboardCheck,
    //   label: "Reviews & Queries",
    //   description: "Status & Communications"
    // },
    {
      path: "/institution/ai-analysis",
      icon: Bot,
      label: "AI Analysis",
      description: "Compliance Reports"
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const logout = async () => {
    try{
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if(response.ok){
        localStorage.removeItem("edu-relational-automation-platform");
        localStorage.removeItem("userRole");
        window.location.href = '/';
      }
    } catch(err){
      console.error("Logout failed:", err);
    }   
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO & BRAND */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold rounded-xl shadow-sm">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Institution Portal
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  UGC/AICTE Compliance System
                </p>
              </div>
            </div>
          </div>

          {/* PRIMARY NAVIGATION */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} 
                  />
                  <div className="text-left">
                    <div className={`font-medium text-[15px] ${
                      isActive ? "text-blue-800" : "text-gray-700 group-hover:text-gray-900"
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-600"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden">
            <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* USER PROFILE & ACCOUNT */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* NOTIFICATION BELL */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">Example Institute</div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`} 
                />
              </button>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                  
                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Building2 size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Example Institute</div>
                        <div className="text-sm text-gray-500">admin@institute.edu</div>
                      </div>
                    </div>
                  </div>

                  {/* MENU ITEMS */}
                  <div className="py-2">
                    <Link
                      to="/institution/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={18} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Institution Profile</div>
                        <div className="text-xs text-gray-500">Manage institution details</div>
                      </div>
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Shield size={18} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Settings</div>
                        <div className="text-xs text-gray-500">Preferences & security</div>
                      </div>
                    </Link>

                    <Link
                      to="/about"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Info size={18} className="text-gray-400" />
                      <div>
                        <div className="font-medium">About & Help</div>
                        <div className="text-xs text-gray-500">Documentation & support</div>
                      </div>
                    </Link>
                  </div>

                  {/* LOGOUT SECTION */}
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-red-500">Logout from portal</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION (Hidden by default) */}
        <div className="lg:hidden mt-4 border-t border-gray-200 pt-4 hidden">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* BACKDROP FOR DROPDOWN */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}