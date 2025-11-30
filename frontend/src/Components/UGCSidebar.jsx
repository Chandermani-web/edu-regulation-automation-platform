import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  FileCheck,
  FileSearch,
  MessageSquare,
  FileText,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const UGCSidebar = ({ activePage }) => {
  const [openModules, setOpenModules] = useState(true);

  return (
    <aside className="w-72 bg-[#0A3D62] text-white min-h-screen shadow-xl">
      {/* Logo */}
      <div className="p-6 text-center border-b border-blue-900">
        <h1 className="text-2xl font-bold tracking-wide">UGC Panel</h1>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">

        {/* Dashboard */}
        <Link
          to="/ugc/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg transition
          ${activePage === "dashboard" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
        `}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>

        {/* Modules */}
        <div>
          <div
            onClick={() => setOpenModules(!openModules)}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-900 rounded-lg"
          >
            <span className="flex items-center gap-3">
              <ClipboardList size={20} /> UGC / AICTE Modules
            </span>

            {openModules ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {openModules && (
            <div className="ml-6 mt-2 space-y-2">

              {/* Application Review */}
              <Link
                to="/ugc/application-review"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "review" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
                `}
              >
                <FileSearch size={18} /> Application Review
              </Link>

              {/* Parameter Verification */}
              <Link
                to="/ugc/parameter-verification"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "param" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
                `}
              >
                <FileCheck size={18} /> Parameter Verification
              </Link>

              {/* Document Verification */}
              <Link
                to="/ugc/document-verification"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "docs" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
                `}
              >
                <FileText size={18} /> Document Verification
              </Link>

              {/* Query Management */}
              <Link
                to="/ugc/query-management"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "queries" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
                `}
              >
                <MessageSquare size={18} /> Query Management
              </Link>

              {/* Review Posting */}
              <Link
                to="/ugc/review-posting"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "review-posting" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
                `}
              >
                <FileText size={18} /> Review Posting
              </Link>

              {/* AI Analysis */}
              <Link
                to="/ugc/ai-analysis"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "ai" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
                `}
              >
                <Bot size={18} /> AI Analysis & Reports
              </Link>

              {/* Approval Page */}
              <Link
                to="/ugc/approval"
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition
                  ${activePage === "approval" ? "bg-white text-[#0A3D62] font-semibold" : "hover:bg-blue-900"}
                `}
              >
                <CheckCircle size={18} /> Approval Page
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default UGCSidebar;
