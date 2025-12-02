import React from 'react'
import InstitutionDashboard from './Institution/Home/InstitutionDashboard.jsx';
import InstitutionNavbar from '../Components/InstitutionNavbar.jsx';

const Dashboard = () => {
  const role = localStorage.getItem("userRole") || "institution";

  return (
    <div className="">
      <header>
        {
          role === "institution" && (
            <InstitutionNavbar />
          )
        }
      </header>

        {/* main content */}
      {role === "institution" && (
        <InstitutionDashboard />
      )}

      {role === "ugc" && (
        <div>📌 UGC Dashboard Features</div>
      )}

      {role === "aicte" && (
        <div>📌 AICTE Dashboard Features</div>
      )}

      {role === "super_admin" && (
        <div>🛠 Super Admin Controls</div>
      )}
    </div>
  );
}

export default Dashboard;