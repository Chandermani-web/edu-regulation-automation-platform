import { useEffect } from 'react';
import { createContext, useState } from 'react'

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [auth, setAuth] = useState(
    () => localStorage.getItem("edu-relational-automation-platform") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try{
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        credentials: 'include'
      });
      if(response.ok){
        const data = await response.json();
        setUser(data);
      }
    }catch(err){
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    const init = async () => {
      await fetchUser();
    }
    init();
  }, []);

  const value = {
    auth,
    setAuth,
    user,
    setUser,
    role,
    loading,
    setRole,
    fetchUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
