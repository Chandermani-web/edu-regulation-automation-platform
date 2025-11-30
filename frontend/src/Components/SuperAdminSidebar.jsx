import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  FileCog,
  ClipboardList,
  Bot,
  Activity,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const SuperAdminSidebar = ({ activePage }) => {
  const [openModules, setOpenModules] = useState(true);

  return (
    <aside className="w-72 bg-[#1B263B] text-white min-h-screen shadow-xl">
      {/* ---------- LOGO ---------- */}
      <div className="p-6 text-center border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wide">Super Admin</h1>
      </div>

      {/* ---------- MENU ---------- */}
      <nav className="p-4 space-y-2">

        {/* 1️⃣ Dashboard */}
        <Link
          to="/superadmin/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg transition
          ${activePage === "dashboard" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
        `}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>

        {/* 2️⃣ Super Admin Modules */}
        <div>
          <div
            onClick={() => setOpenModules(!openModules)}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 rounded-lg"
          >
            <span className="flex items-center gap-3">
              <Settings size={20} /> Super Admin Modules
            </span>

            {openModules ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {openModules && (
            <div className="ml-6 mt-2 space-y-2">

              {/* User Management */}
              <Link
                to="/superadmin/user-management"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "users" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
                `}
              >
                <Users size={18} /> User Management
              </Link>

              {/* Institution Management */}
              <Link
                to="/superadmin/institution-management"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "institutions" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
                `}
              >
                <Building2 size={18} /> Institution Management
              </Link>

              {/* Parameter Management */}
              <Link
                to="/superadmin/parameters-management"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "parameters" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
                `}
              >
                <ClipboardList size={18} /> Parameters Management
              </Link>

              {/* Document Category Management */}
              <Link
                to="/superadmin/document-category"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "document-categories" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
                `}
              >
                <FileCog size={18} /> Document Categories
              </Link>

              {/* Applications Management */}
              <Link
                to="/superadmin/applications-management"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "applications" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
                `}
              >
                <FileCog size={18} /> Applications Management
              </Link>

              {/* AI Model Management */}
              <Link
                to="/superadmin/ai-model"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "ai" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
                `}
              >
                <Bot size={18} /> AI Model Management
              </Link>

              {/* Logs & Analytics */}
              <Link
                to="/superadmin/logs-analytics"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "logs" ? "bg-white text-[#1B263B] font-semibold" : "hover:bg-gray-700"}
                `}
              >
                <Activity size={18} /> Logs & Analytics
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default SuperAdminSidebar;
