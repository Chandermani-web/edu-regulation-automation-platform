import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  FileSpreadsheet,
  FileUp,
  FileCheck,
  MessageSquare,
  MessageCircleQuestion,
  Bot,
  FileText,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Institution Profile", icon: <UserCircle size={18} />, path: "/institution/profile" },
    { name: "Parameters Entry", icon: <FileSpreadsheet size={18} />, path: "/parameters" },
    { name: "Document Upload", icon: <FileUp size={18} />, path: "/documents" },
    { name: "Applications", icon: <FileCheck size={18} />, path: "/applications" },
    { name: "Queries", icon: <MessageSquare size={18} />, path: "/queries" },
    { name: "Reviews", icon: <MessageCircleQuestion size={18} />, path: "/reviews" },
    { name: "AI Analytics", icon: <Bot size={18} />, path: "/ai-analytics" },
    { name: "AI Reports", icon: <FileText size={18} />, path: "/ai-reports" },
  ];

  return (
    <div className="h-screen w-64 bg-[#0F172A] text-white p-6 flex flex-col shadow-lg">

      {/* Logo */}
      <h2 className="text-xl font-bold mb-10 tracking-wide text-blue-300">
        Menu
      </h2>

      {/* Menu List */}
      <ul className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
                 ${isActive ? "bg-blue-600 text-white shadow" : "text-gray-300 hover:bg-blue-500/20"}
               `}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="mt-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
