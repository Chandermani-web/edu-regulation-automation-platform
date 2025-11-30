

import React, { useContext, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import AppContext from "./Context/UseContext";

// Institution Panel
import InstitutionDashboard from "./Pages/Institution/InstitutionDashboard";
import InstitutionProfile from "./Pages/Institution/InstitutionProfile";
import ParametersEntry from "./Pages/Institution/ParametersEntry";
import DocumentUpload from "./Pages/Institution/DocumentUpload";
import ApplicationSubmission from "./Pages/Institution/ApplicationSubmission";
import Queries from "./Pages/Institution/Queries";
import Reviews from "./Pages/Institution/Reviews";
import AIAnalytics from "./Pages/Institution/AIAnalytics";
import AIReports from "./Pages/Institution/AIReports";

// UGC/AICTE Panel
import UGCDashboard from "./Pages/UGCAICTEPanel/UGCDashboard";
import ApplicationReview from "./Pages/UGCAICTEPanel/ApplicationReview";
import ParameterVerification from "./Pages/UGCAICTEPanel/ParameterVerification";
import DocumentVerification from "./Pages/UGCAICTEPanel/DocumentVerification";
import QueryManagement from "./Pages/UGCAICTEPanel/QueryManagement";
import ReviewPosting from "./Pages/UGCAICTEPanel/ReviewPosting";
import AIAnalysis from "./Pages/UGCAICTEPanel/AIAnalysis";
import ApprovalPage from "./Pages/UGCAICTEPanel/ApprovalPage";

// Super Admin Panel
import SuperAdminDashboard from "./Pages/SuperAdminPanel/SuperAdminDashboard";
import UserManagement from "./Pages/SuperAdminPanel/UserManagement";
import InstitutionManagement from "./Pages/SuperAdminPanel/InstitutionManagement";
import ParametersManagement from "./Pages/SuperAdminPanel/ParametersManagement";
import DocumentCategoryManagement from "./Pages/SuperAdminPanel/DocumentCategoryManagement";
import ApplicationsManagement from "./Pages/SuperAdminPanel/ApplicationManagement";
import AIModelManagement from "./Pages/SuperAdminPanel/AIModelManagement";
import LogsAnalytics from "./Pages/SuperAdminPanel/LogsAnalytics";


import Loading from "./Utils/Loading";

const App = () => {
  const { auth, role } = useContext(AppContext);

  // Select Dashboard based on role
  let DashboardToRender;

  if (role === "institution") {
    DashboardToRender = <InstitutionDashboard />;
  } else if (role === "ugc" || role === "aicte") {
    DashboardToRender = <UGCDashboard />;
  } else if (role === "superadmin") {
    DashboardToRender = <SuperAdminDashboard />;
  } else {
    DashboardToRender = <h1>No role found</h1>;
  }


  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={DashboardToRender} />

        {/* Institution Routes */}
        <Route path="/institution/profile" element={<InstitutionProfile />} />
        <Route path="/parameters" element={<ParametersEntry />} />
        <Route path="/documents" element={<DocumentUpload />} />
        <Route path="/applications" element={<ApplicationSubmission />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/ai-analytics" element={<AIAnalytics />} />
        <Route path="/ai-reports" element={<AIReports />} />

        {/* UGC/AICTE Routes */}
        <Route path="/ugc/dashboard" element={<UGCDashboard />} />
        <Route path="/ugc/application-review" element={<ApplicationReview />} />
        <Route path="/ugc/parameter-verification" element={<ParameterVerification />} />
        <Route path="/ugc/document-verification" element={<DocumentVerification />} />
        <Route path="/ugc/query-management" element={<QueryManagement />} />
        <Route path="/ugc/review-posting" element={<ReviewPosting />} />
        <Route path="/ugc/ai-analysis" element={<AIAnalysis />} />
        <Route path="/ugc/approval" element={<ApprovalPage />} /> 

        {/*Super Admin Routes */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard/>} />
        <Route path="/superadmin/user-management" element={<UserManagement />} />
        <Route path="/superadmin/institution-management" element={<InstitutionManagement />} />
        <Route path="/superadmin/parameters-management" element={<ParametersManagement />} />
        <Route path="/superadmin/document-category" element={<DocumentCategoryManagement />} />
        <Route path="/superadmin/applications-management" element={<ApplicationsManagement />} />
        <Route path="/superadmin/ai-model" element={<AIModelManagement />} />
        <Route path="/superadmin/logs-analytics" element={<LogsAnalytics />} />  

        
        
      </Routes>
    </Suspense>
  );
};

export default App;
