import React, { useContext , Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from 'lucide-react';
import Login from './Pages/Login';
import AppContext from './Context/UseContext';
import InstitutionDashboard from './Pages/Institution/Home/InstitutionDashboard';
import InstitutionApplicationPage from './Pages/Institution/Application/Application';
import InstitutionProfile from './Pages/Institution/InstitutionProfile';
import ParametersEntry from './Pages/Institution/ParametersEntry';
import DocumentUpload from './Pages/Institution/DocumentUpload';
import ApplicationSubmission from './Pages/Institution/ApplicationSubmission';
import Queries from './Pages/Institution/Queries';
import Reviews from './Pages/Institution/Reviews';
import AIAnalytics from './Pages/Institution/AIAnalytics';
import AIReports from './Pages/Institution/AIReports';
import Loading from './Utils/Loading';
import Dashboard from './Pages/Dashboard';
import InstitutionNavbar from './Components/InstitutionNavbar';
import AIAnalyticsAndReports from './Pages/Institution/Report/ApplicationReport';
import LandingPage from './Pages/LandingPage';

const App = () => {
  const { auth } = useContext(AppContext);
  console.log(auth)
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path='/dashboard' element={auth ? <Dashboard /> : <LandingPage />} />
          
          {/* institution routes */}
          <Route path="/institution/dashboard" element={<InstitutionDashboard/>} />
          <Route path="/institution/application" element={<InstitutionApplicationPage />} />
          
          <Route path="/institution/profile" element={<InstitutionProfile />} />
          <Route path="/institution/parameters/:id" element={<ParametersEntry />} />
          <Route path="/institution/documents/:id" element={<DocumentUpload />} />
          <Route path="/institution/application-submission/:id" element={<ApplicationSubmission />} />
          <Route path="/institution/queries" element={<Queries/>} />
          <Route path="/institution/reviews" element={<Reviews/>} />
          <Route path="/institution/ai-analysis/:id" element={<AIAnalytics />} />
          <Route path="/institution/ai-reports/:id" element={<AIReports />} />
          <Route path='/institution/ai-analysis' element={<AIAnalyticsAndReports />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
