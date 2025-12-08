import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  MessageSquare,
  LogOut,
  Building2,
  Shield,
  Award,
  ChevronRight,
  GitCompare
} from "lucide-react";

const AICTESidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      path: "/aicte/dashboard" 
    },
    { 
      name: "Latest Applications", 
      icon: <FileSpreadsheet size={20} />, 
      path: "/aicte/latest-application" 
    },
    { 
      name: "Institution Comparison", 
      icon: <GitCompare size={20} />, 
      path: "/aicte/comparison" 
    },
    { 
      name: "Approved Universities", 
      icon: <Building2 size={20} />, 
      path: "/aicte/university" 
    },
    { 
      name: "NIRF Ranking", 
      icon: <Award size={20} />, 
      path: "/aicte/nirf-ranking" 
    },
    { 
      name: "Review & Queries", 
      icon: <MessageSquare size={20} />, 
      path: "/aicte/queries-and-review" 
    },
    { 
      name: "Final Approval", 
      icon: <Shield size={20} />, 
      path: "/aicte/final-approval" 
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (response.ok) {
        localStorage.removeItem("edu-relational-automation-platform");
        localStorage.removeItem("userRole");
        navigate('/');
        window.location.reload();
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback to local logout
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col shadow-xl sticky top-0">
      
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-2xl shadow-lg">
            <Building2 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AICTE</h1>
            <p className="text-sm text-gray-600 font-medium">Evaluation Portal</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
          <Shield size={16} />
          <span className="font-semibold">Administrator Access</span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-6" />

      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-1">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Navigation
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isActiveStyle = location.pathname.startsWith(item.path) && item.path !== "/ugc";

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive || isActiveStyle 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-100" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive || isActiveStyle ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                {(isActive || isActiveStyle) && (
                  <ChevronRight size={16} className="text-white/80" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout Section */}
      <div className="p-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200 group"
        >
          <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
            <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
          </div>
          <span className="font-semibold">Logout</span>
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            v2.1.0 • © 2024 UGC Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICTESidebar;