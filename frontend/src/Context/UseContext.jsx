// ------------------------ USECONTEXT.JSX ------------------------

import { createContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Login status (from localStorage)
  const [auth, setAuth] = useState(
    localStorage.getItem("auth") === "true" 
  );

  // User role (institution, ugc, aicte, superadmin)
  const [role, setRole] = useState(localStorage.getItem("userRole") || null);

  // User full profile (optional)
  const [user, setUser] = useState(null);

  // Loading state for profile
  const [loading, setLoading] = useState(false);

  // ------------------------ BACKEND USER PROFILE (COMMENTED) ------------------------
  /*
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user on first page load
  useEffect(() => {
    if (auth) {
      fetchUser();
    }
  }, []);
  */
  // -------------------------------------------------------------------------------

  const value = {
    auth,
    setAuth,
    role,
    setRole,
    user,
    setUser,
    loading,
    // fetchUser, // Uncomment when backend is ready
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContext;
