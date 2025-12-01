import { useEffect } from "react";
import { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    () => localStorage.getItem("edu-relational-automation-platform") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // current institution id for filling the details (parameters, documents, application)
  const [currentInstitutionId, setCurrentInstitutionId] = useState(()=>{
    return localStorage.getItem("currentInstitutionId") || null;
  });
  const [currentInstitutionData, setCurrentInstitutionData] = useState(()=>
    JSON.parse(localStorage.getItem("currentInstitutionData")) || null
  );

  // for users
  const [institutionDetails, setInstitutionDetails] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(null);

  // for aicte/ugc super admin to get all institutions
  const [allInstitutionDetails, setAllInstitutionDetails] = useState(null);
  const [allApplicationDetails, setAllApplicationDetails] = useState(null);

  const getApiUrl = () => "http://localhost:3000";

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem("edu-relational-automation-platform", "true");
        localStorage.setItem("userRole", data.role);
        setAuth(true);
        setRole(data.role);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUser(null);
      localStorage.removeItem("edu-relational-automation-platform");
      localStorage.removeItem("userRole");
      setAuth(false);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutionById = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/institution/my`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setInstitutionDetails(data);
      }
    } catch (err) {
      console.error("Error fetching institution data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationById = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${getApiUrl()}/api/institution/application/get`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            institution_id: institutionDetails?._id,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setApplicationDetails(data.application);
      }
    } catch (err) {
      console.error("Error fetching application data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllInstitutions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/institution/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAllInstitutionDetails(data);
      }
    } catch (err) {
      console.error("Error fetching all institutions:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${getApiUrl()}/api/institution/application/all`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAllApplicationDetails(data);
      }
    } catch (err) {
      console.error("Error fetching all applications:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      // if the user is has logged in
      if (auth) {
        
        await fetchInstitutionById();
        // if the institution details are available
        if (institutionDetails?._id) {
          await Promise.all([
            fetchApplicationById(),
            fetchAllInstitutions(),
            fetchAllApplications(),
          ]);
        }
      }

    };
    init();
  }, []);

  console.log("Institution Details in Context:", institutionDetails);

  const value = {
    auth,
    setAuth,
    user,
    setUser,
    role,
    loading,
    setRole,
    fetchUser,
    institutionDetails,
    fetchInstitutionById,
    applicationDetails,
    fetchApplicationById,
    allInstitutionDetails,
    fetchAllInstitutions,
    allApplicationDetails,
    fetchAllApplications,
    getApiUrl,

    currentInstitutionId,
    setCurrentInstitutionId,
    currentInstitutionData,
    setCurrentInstitutionData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
