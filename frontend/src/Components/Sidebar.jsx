import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#0f172a] text-white p-6">
      <h2 className="text-xl font-bold mb-8">Menu</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/institution/profile">Institution Profile</Link>
        </li>

        <li>
          <Link to="/parameters">Parameters Entry</Link>
        </li>

        <li>
          <Link to="/documents">Document Upload</Link>
        </li>

        <li>
          <Link to="/applications">Applications</Link>
        </li>

        <li>
          <Link to="/queries">Queries</Link>
        </li>

        <li>
          <Link to="/reviews">Reviews</Link>
        </li>

        <li>
          <Link to="/ai-analytics">AI Analytics</Link>
        </li>

        <li>
          <Link to="/ai-reports">Reports</Link>
        </li>

        <li className="pt-10 text-red-400">
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
