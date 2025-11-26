import React, { useContext , Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from 'lucide-react';
import Login from './Pages/Login';
import AppContext from './Context/UseContext';
import Dashboard from './Pages/Dashboard';

const App = () => {
  const { auth } = useContext(AppContext);
  console.log(auth)
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<InstitutionDashboard/>} />
          <Route path="/institution/profile" element={<InstitutionProfile />} />
          <Route path="/parameters" element={<ParametersEntry />} />
          <Route path="/documents" element={<DocumentUpload />} />
          <Route path="/applications" element={<ApplicationSubmission />} />
          <Route path="/queries" element={<Queries/>} />
          <Route path="/reviews" element={<Reviews/>} />
          <Route path="/ai-analytics" element={<AIAnalytics />} />
          <Route path="/ai-reports" element={<AIReports />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
