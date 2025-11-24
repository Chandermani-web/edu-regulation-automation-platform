import { createContext, useState } from 'react'

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [auth, setAuth] = useState(
    () => localStorage.getItem("edu-relational-automation-platform") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("userRole"));

  const [user, setUser] = useState(null);

  const value = {
    auth,
    setAuth,
    user,
    setUser,
    role,
    setRole
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
