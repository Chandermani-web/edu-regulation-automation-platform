import React from 'react'

const Dashboard = () => {
  const role = localStorage.getItem("userRole");

  return (
    <div className="p-4 text-xl">
      Dashboard for <b>{role?.toUpperCase()}</b>

      {role === "institution" && (
        <div>📌 Institution Dashboard Features</div>
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