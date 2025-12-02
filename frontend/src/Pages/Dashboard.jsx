import React from "react";
import InstitutionDashboard from "./Institution/Home/InstitutionDashboard.jsx";
import InstitutionNavbar from "../Components/InstitutionNavbar.jsx";
import UGCDashboard from "./UGC/UGCDashboard.jsx";
import AICTEDashboard from "./AICTE/AICTEDashboard.jsx";
import SuperAdminDashboard from "./Super_admin/SuperAdminDashboard.jsx";

const Dashboard = () => {
  const role = localStorage.getItem("userRole") || "institution";

  return (
    <div className="">
      {/* main content */}
      {role === "institution" && <InstitutionDashboard />}

      {role === "aicte" && <AICTEDashboard />}

      {role === "ugc" && <UGCDashboard />}

      {role === "super_admin" && <SuperAdminDashboard />}
    </div>
  );
};

export default Dashboard;
