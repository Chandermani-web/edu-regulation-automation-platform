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
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={auth ? <Dashboard /> : <Login />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
