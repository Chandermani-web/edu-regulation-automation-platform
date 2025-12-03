import React, { useContext , Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from 'lucide-react';
import Login from './Pages/Login';
import AppContext from './Context/UseContext';
import Dashboard from './Pages/Dashboard';

// institution routes
import InstitutionDashboard from './Pages/Institution/Home/InstitutionDashboard';
import InstitutionApplicationPage from './Pages/Institution/Application/Application';
import InstitutionProfile from './Pages/Institution/InstitutionProfile';
import ParametersEntry from './Pages/Institution/ParametersEntry';
import DocumentUpload from './Pages/Institution/DocumentUpload';
import ApplicationSubmission from './Pages/Institution/ApplicationSubmission';
// import Queries from './Pages/Institution/Queries';
// import Reviews from './Pages/Institution/Reviews';
import AIAnalytics from './Pages/Institution/AIAnalytics';
import AIReports from './Pages/Institution/AIReports';
import Loading from './Utils/Loading';
import InstitutionNavbar from './Components/InstitutionNavbar';
import AIAnalyticsAndReports from './Pages/Institution/Report/ApplicationReport';
import LandingPage from './Pages/LandingPage';

// ugc routes
import UGCDashboard from './Pages/UGC/UGCDashboard';
import LatestApplication from './Pages/UGC/UGCLatestApplication';
import QueriesAndReview from './Pages/UGC/UGCQueriesAndReview';
import College from './Pages/UGC/College';
import UGCFinalApproval from './Pages/UGC/UGCFinalApproval';
import UGCNIRFRanking from './Pages/UGC/UGCNIRFRanking';

// aicte routes
import AICTEDashboard from './Pages/AICTE/AICTEDashboard';
import AICTELatestApplication from './Pages/AICTE/AICTELatestApplication';
import AICTEQueriesAndReview from './Pages/AICTE/AICTEQueriesAndReview';
import University from './Pages/AICTE/University';
import FinalApproval from './Pages/AICTE/AICTEFinalApproval';
import NIRFRanking from './Pages/AICTE/AICTENIRFRanking';


import SuperAdminDashboard from './Pages/Super_admin/SuperAdminDashboard';
import SuperAdminLatestApplication from './Pages/Super_admin/SuperAdminLatestApplication';
import SuperAdminUniversities from './Pages/Super_admin/SuperAdminUniversities';
import SuperAdminReviewsAndQueries from './Pages/Super_admin/SuperAdminReviewsAndQueries';
import SuperAdminNIRFRanking from './Pages/Super_admin/SuperAdminNIRFRanking';
import SuperAdminColleges from './Pages/Super_admin/SuperAdminColleges';
import ReviewAndQueryPage from './Pages/Institution/Reviews/ReviewsAndQueries';


const App = () => {
  const { auth, role } = useContext(AppContext);
  console.log(auth)
  return (
    <div className="min-h-screen bg-gray-100">
      <header>
        {
          role === "institution" && (
            <InstitutionNavbar />
          )
        }
      </header>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={auth ? <Dashboard /> : <LandingPage />} />
          <Route path="/login" element={auth ? <Dashboard /> : <Login />} />
          <Route path='/dashboard' element={auth ? <Dashboard /> : <LandingPage />} />
          
          {/* institution routes */}
          <Route path="/institution/dashboard" element={auth ? role == "institution" ? <InstitutionDashboard/> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/application" element={auth ? role == "institution" ? <InstitutionApplicationPage /> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/profile" element={auth ? role == "institution" ? <InstitutionProfile /> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/parameters/:id" element={auth ? role == "institution" ? <ParametersEntry /> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/documents/:id" element={auth ? role == "institution" ? <DocumentUpload /> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/application-submission/:id" element={auth ? role == "institution" ? <ApplicationSubmission /> : <LandingPage /> : <LandingPage />} />
          {/* <Route path="/institution/queries" element={auth ? role == "institution" ? <Queries/> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/reviews" element={auth ? role == "institution" ? <Reviews/> : <LandingPage /> : <LandingPage />} /> */}
          <Route path='/institution/queries-and-review' element={auth ? role == "institution" ? <ReviewAndQueryPage /> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/ai-analysis/:id" element={auth ? role == "institution" ? <AIAnalytics /> : <LandingPage /> : <LandingPage />} />
          <Route path="/institution/ai-reports/:id" element={auth ? role == "institution" ? <AIReports /> : <LandingPage /> : <LandingPage />} />
          <Route path='/institution/ai-analysis' element={auth ? role == "institution" ? <AIAnalyticsAndReports  /> : <LandingPage /> : <LandingPage />} />
          {/* institution routes end */}

          {/* ugc routes */}
          <Route path="/ugc/dashboard" element={auth ? role == "ugc" ? <UGCDashboard /> : <LandingPage /> : <LandingPage />} />
          <Route path="/ugc/latest-application" element={auth ? role == "ugc" ? <LatestApplication /> : <LandingPage /> : <LandingPage />} />
          <Route path="/ugc/queries-and-review" element={auth ? role == "ugc" ? <QueriesAndReview /> : <LandingPage /> : <LandingPage />} />
          <Route path="/ugc/college" element={auth ? role == "ugc" ? <College /> : <LandingPage /> : <LandingPage />} />
          <Route path='/ugc/final-approval' element={auth ? role == "ugc" ? <UGCFinalApproval /> : <LandingPage /> : <LandingPage />} />
          <Route path="/ugc/nirf-ranking" element={auth ? role == "ugc" ? <UGCNIRFRanking /> : <LandingPage /> : <LandingPage />} />
          {/* ugc routes end */}

          {/* aicte routes */}
          <Route path="/aicte/dashboard" element={auth ? role == "aicte" ? <AICTEDashboard /> : <LandingPage /> : <LandingPage />} />
          <Route path="/aicte/latest-application" element={auth ? role == "aicte" ? <AICTELatestApplication /> : <LandingPage /> : <LandingPage />} />
          <Route path="/aicte/queries-and-review" element={auth ? role == "aicte" ? <AICTEQueriesAndReview /> : <LandingPage /> : <LandingPage />} />
          <Route path="/aicte/university" element={auth ? role == "aicte" ? <University /> : <LandingPage /> : <LandingPage />} />
          <Route path="/aicte/final-approval" element={auth ? role == "aicte" ? <FinalApproval /> : <LandingPage /> : <LandingPage />} />
          <Route path="/aicte/nirf-ranking" element={auth ? role == "aicte" ? <NIRFRanking /> : <LandingPage /> : <LandingPage />} />
          {/* aicte routes end */}

          {/* super_admin routes */}
          <Route path="/super-admin/dashboard" element={auth ? role == "super_admin" ? <SuperAdminDashboard /> : <LandingPage /> : <LandingPage />} />
          <Route path="/super-admin/latest-application" element={auth ? role == "super_admin" ? <SuperAdminLatestApplication /> : <LandingPage /> : <LandingPage />} />
          <Route path="/super-admin/queries-and-review" element={auth ? role == "super_admin" ? <SuperAdminReviewsAndQueries /> : <LandingPage /> : <LandingPage />} />
          <Route path="/super-admin/university" element={auth ? role == "super_admin" ? <SuperAdminUniversities /> : <LandingPage /> : <LandingPage />} />
          <Route path='/super-admin/college' element={auth ? role == "super_admin" ? <SuperAdminColleges /> : <LandingPage /> : <LandingPage />} />
          <Route path="/super-admin/nirf-ranking" element={auth ? role == "super_admin" ? <SuperAdminNIRFRanking /> : <LandingPage /> : <LandingPage />} />
          {/* super_admin routes end */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
